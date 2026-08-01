"""Development-only orchestration for validating the forecasting pipeline."""

from pathlib import Path
from typing import Any

import pandas as pd
from pydantic import BaseModel, ConfigDict, Field

from app.core.config import Settings
from app.forecasting.features import SalesFeatureBuilder
from app.forecasting.predictor import ForecastPredictionError, ForecastPredictionService
from app.forecasting.rails_client import (
    RailsProductClient,
    RailsProductClientError,
    RailsSalesHistoryClient,
    RailsSalesHistoryClientError,
)
from app.forecasting.reorder_engine import ReorderEngine
from app.forecasting.trainer import ForecastTrainingError, ForecastTrainingService


class ForecastDebugResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sales_records: int = Field(ge=0)
    features_generated: bool
    model_loaded: bool
    predicted_7_day_sales: list[int]
    total_predicted_sales: int = Field(ge=0)
    dynamic_reorder_level: int = Field(ge=0)
    recommended_order_quantity: int = Field(ge=0)
    inventory_risk: str


class ForecastDebugError(Exception):
    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ForecastDebugService:
    """Runs existing pipeline components and reports their development diagnostics."""

    def __init__(
        self,
        settings: Settings,
        sales_history_client: RailsSalesHistoryClient,
        product_client: RailsProductClient,
        training_service: ForecastTrainingService,
        prediction_service: ForecastPredictionService,
        feature_builder: SalesFeatureBuilder | None = None,
    ) -> None:
        self._settings = settings
        self._sales_history_client = sales_history_client
        self._product_client = product_client
        self._training_service = training_service
        self._prediction_service = prediction_service
        self._feature_builder = feature_builder or SalesFeatureBuilder()

    async def validate(
        self,
        product_id: int,
        authorization_header: str | None = None,
    ) -> ForecastDebugResponse:
        try:
            sales_history = await self._sales_history_client.fetch_product(
                product_id=product_id,
                authorization_header=authorization_header,
            )
            features_generated = self._features_generated(product_id, sales_history)

            # Development-only: run the existing training service before loading the model.
            await self._training_service.train(authorization_header=authorization_header)
            forecast = await self._prediction_service.predict(
                product_id=product_id,
                authorization_header=authorization_header,
            )
            current_stock = await self._product_client.fetch_current_stock(
                product_id=product_id,
                authorization_header=authorization_header,
            )
        except (
            ForecastPredictionError,
            ForecastTrainingError,
            RailsProductClientError,
            RailsSalesHistoryClientError,
        ) as error:
            raise ForecastDebugError(error.message, error.status_code) from error

        decision = ReorderEngine(
            lead_time_days=self._settings.forecast_reorder_lead_time_days,
            safety_stock_percentage=self._settings.forecast_reorder_safety_stock_percentage,
        ).recommend(
            product_id=product_id,
            current_stock=current_stock,
            predicted_7_day_sales=forecast.total_predicted_sales,
        )

        return ForecastDebugResponse(
            sales_records=len(sales_history),
            features_generated=features_generated,
            model_loaded=self._model_exists(product_id),
            predicted_7_day_sales=[
                prediction.predicted_sales for prediction in forecast.predictions
            ],
            total_predicted_sales=forecast.total_predicted_sales,
            dynamic_reorder_level=decision.dynamic_reorder_level,
            recommended_order_quantity=decision.recommended_order_quantity,
            inventory_risk=decision.inventory_risk,
        )

    def _features_generated(
        self,
        product_id: int,
        sales_history: list[dict[str, Any]],
    ) -> bool:
        frame = pd.DataFrame.from_records(sales_history)
        required_columns = ["product_id", "sale_date", "quantity_sold"]
        if frame.empty or any(column not in frame.columns for column in required_columns):
            return False

        frame = frame[required_columns].copy()
        frame["product_id"] = pd.to_numeric(frame["product_id"], errors="coerce")
        frame = frame[frame["product_id"] == product_id]
        prepared_history = self._feature_builder.prepare_sales_history(frame)
        features, _ = self._feature_builder.split_features_and_target(prepared_history)
        return not features.empty

    def _model_exists(self, product_id: int) -> bool:
        return (Path(self._settings.forecast_models_dir) / f"{product_id}.joblib").is_file()

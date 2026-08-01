from datetime import timedelta
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from app.core.config import Settings
from app.forecasting.features import FEATURE_COLUMNS, TARGET_COLUMN, SalesFeatureBuilder
from app.forecasting.rails_client import (
    RailsSalesHistoryClient,
    RailsSalesHistoryClientError,
)
from app.forecasting.trainer import MINIMUM_TRAINING_RECORDS
from app.schemas.forecast_prediction import ForecastPrediction, ProductForecastResponse

PREDICTION_DAYS = 7


class ForecastPredictionError(Exception):
    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ForecastPredictionService:
    def __init__(
        self,
        settings: Settings,
        sales_history_client: RailsSalesHistoryClient,
        feature_builder: SalesFeatureBuilder | None = None,
    ) -> None:
        self._settings = settings
        self._sales_history_client = sales_history_client
        self._feature_builder = feature_builder or SalesFeatureBuilder()

    async def predict(
        self,
        product_id: int,
        authorization_header: str | None = None,
    ) -> ProductForecastResponse:
        try:
            sales_history = await self._sales_history_client.fetch_product(
                product_id=product_id,
                authorization_header=authorization_header,
            )
        except RailsSalesHistoryClientError as error:
            raise ForecastPredictionError(error.message, error.status_code) from error

        product_history = self._product_history_frame(product_id, sales_history)
        if product_history.empty:
            raise ForecastPredictionError(
                f"Product {product_id} needs at least one sales record before a forecast can be generated.",
                422,
            )

        model_artifact = self._load_model_artifact(product_id)
        if model_artifact is not None and len(product_history) >= MINIMUM_TRAINING_RECORDS:
            predictions = self._predict_next_days(
                model=self._model_from_artifact(model_artifact),
                feature_columns=self._feature_columns_from_artifact(model_artifact),
                sales_history=product_history,
            )
        else:
            predictions = self._baseline_predictions(product_history)
        predicted_values = [prediction.predicted_sales for prediction in predictions]
        total_predicted_sales = sum(predicted_values)

        return ProductForecastResponse(
            product_id=product_id,
            predictions=predictions,
            average_daily_sales=round(total_predicted_sales / PREDICTION_DAYS, 1),
            total_predicted_sales=total_predicted_sales,
        )

    def _load_model_artifact(self, product_id: int) -> Any | None:
        model_path = Path(self._settings.forecast_models_dir) / f"{product_id}.joblib"
        if not model_path.exists():
            # A product can be forecast from its sales history before the nightly
            # training job has created its own persisted model.
            return None

        try:
            return joblib.load(model_path)
        except Exception as error:
            raise ForecastPredictionError(
                f"Model for product {product_id} could not be loaded.",
                422,
            ) from error

    def _product_history_frame(
        self,
        product_id: int,
        sales_history: list[dict[str, Any]],
    ) -> pd.DataFrame:
        frame = pd.DataFrame.from_records(sales_history)
        if frame.empty:
            return pd.DataFrame(columns=["sale_date", TARGET_COLUMN])

        required_columns = ["product_id", "sale_date", TARGET_COLUMN]
        missing_columns = [column for column in required_columns if column not in frame.columns]
        if missing_columns:
            raise ForecastPredictionError(
                f"Sales history is missing required columns: {', '.join(missing_columns)}.",
                502,
            )

        frame = frame[required_columns].copy()
        frame["product_id"] = pd.to_numeric(frame["product_id"], errors="coerce")
        frame = frame[frame["product_id"] == product_id]

        return self._feature_builder.prepare_sales_history(frame)

    def _predict_next_days(
        self,
        model: Any,
        feature_columns: list[str],
        sales_history: pd.DataFrame,
    ) -> list[ForecastPrediction]:
        first_sale_date = sales_history["sale_date"].min()
        last_sale_date = sales_history["sale_date"].max().date()
        prior_sales = sales_history[TARGET_COLUMN].astype(float).tolist()
        predictions: list[ForecastPrediction] = []

        for day_offset in range(1, PREDICTION_DAYS + 1):
            prediction_date = last_sale_date + timedelta(days=day_offset)
            features = self._feature_builder.build_prediction_features(
                first_sale_date=first_sale_date,
                prediction_date=prediction_date,
                prior_sales=prior_sales,
            )
            predicted_sales = self._predict_sales(
                model=model,
                features=features[feature_columns],
            )
            prior_sales.append(float(predicted_sales))
            predictions.append(
                ForecastPrediction(
                    date=prediction_date,
                    predicted_sales=predicted_sales,
                )
            )

        return predictions

    def _baseline_predictions(self, sales_history: pd.DataFrame) -> list[ForecastPrediction]:
        """Use recent demand until this product has a trained model."""
        last_sale_date = sales_history["sale_date"].max().date()
        recent_demand = sales_history[TARGET_COLUMN].tail(7).astype(float)
        predicted_sales = max(int(round(recent_demand.mean())), 0)

        return [
            ForecastPrediction(
                date=last_sale_date + timedelta(days=day_offset),
                predicted_sales=predicted_sales,
            )
            for day_offset in range(1, PREDICTION_DAYS + 1)
        ]

    def _model_from_artifact(self, model_artifact: Any) -> Any:
        model = model_artifact.get("model") if isinstance(model_artifact, dict) else model_artifact

        if not hasattr(model, "predict"):
            raise ForecastPredictionError("Saved model artifact is invalid.", 422)

        return model

    def _feature_columns_from_artifact(self, model_artifact: Any) -> list[str]:
        if isinstance(model_artifact, dict):
            feature_columns = model_artifact.get("feature_columns", FEATURE_COLUMNS)
        else:
            feature_columns = FEATURE_COLUMNS

        if feature_columns != FEATURE_COLUMNS:
            raise ForecastPredictionError("Saved model artifact uses unsupported features.", 422)

        return feature_columns

    def _predict_sales(self, model: Any, features: pd.DataFrame) -> int:
        raw_prediction = model.predict(features)[0]
        return max(int(round(float(raw_prediction))), 0)

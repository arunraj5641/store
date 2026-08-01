from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from app.core.config import Settings
from app.forecasting.features import FEATURE_COLUMNS, SalesFeatureBuilder
from app.forecasting.model_factory import ForecastModelFactory
from app.forecasting.rails_client import (
    RailsSalesHistoryClient,
    RailsSalesHistoryClientError,
)
from app.schemas.forecast_training import TrainForecastResponse

MINIMUM_TRAINING_RECORDS = 14


class ForecastTrainingError(Exception):
    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ForecastTrainingService:
    def __init__(
        self,
        settings: Settings,
        sales_history_client: RailsSalesHistoryClient,
        feature_builder: SalesFeatureBuilder | None = None,
        model_factory: ForecastModelFactory | None = None,
    ) -> None:
        self._settings = settings
        self._sales_history_client = sales_history_client
        self._feature_builder = feature_builder or SalesFeatureBuilder()
        self._model_factory = model_factory or ForecastModelFactory()

    async def train(self, authorization_header: str | None = None) -> TrainForecastResponse:
        try:
            sales_history = await self._sales_history_client.fetch_all(
                authorization_header=authorization_header,
            )
        except RailsSalesHistoryClientError as error:
            raise ForecastTrainingError(error.message, error.status_code) from error

        training_frame = self._to_training_frame(sales_history)
        models_dir = Path(self._settings.forecast_models_dir)
        models_dir.mkdir(parents=True, exist_ok=True)

        trained_products = 0
        skipped_products: list[int] = []

        for product_id, product_sales in training_frame.groupby("product_id"):
            product_id = int(product_id)
            product_sales = product_sales.sort_values("sale_date")

            if len(product_sales) < MINIMUM_TRAINING_RECORDS:
                skipped_products.append(product_id)
                continue

            features, target = self._feature_builder.split_features_and_target(product_sales)
            model = self._model_factory.create()
            model.fit(features, target)

            self._save_model(models_dir, product_id, model, len(product_sales))
            trained_products += 1

        return TrainForecastResponse(
            trained_products=trained_products,
            skipped_products=skipped_products,
            models_saved=True,
        )

    def _to_training_frame(self, sales_history: list[dict[str, Any]]) -> pd.DataFrame:
        frame = pd.DataFrame.from_records(sales_history)

        if frame.empty:
            return pd.DataFrame(columns=["product_id", "sale_date", "quantity_sold"])

        required_columns = ["product_id", "sale_date", "quantity_sold"]
        missing_columns = [column for column in required_columns if column not in frame.columns]
        if missing_columns:
            raise ForecastTrainingError(
                f"Sales history is missing required columns: {', '.join(missing_columns)}.",
                502,
            )

        frame = frame[required_columns].copy()
        frame["product_id"] = pd.to_numeric(frame["product_id"], errors="coerce")
        frame["quantity_sold"] = pd.to_numeric(frame["quantity_sold"], errors="coerce")
        frame["sale_date"] = pd.to_datetime(frame["sale_date"], errors="coerce")
        frame = frame.dropna(subset=required_columns)
        frame["product_id"] = frame["product_id"].astype(int)
        frame["quantity_sold"] = frame["quantity_sold"].astype(float)

        return frame

    def _save_model(
        self,
        models_dir: Path,
        product_id: int,
        model: Any,
        training_records: int,
    ) -> None:
        model_artifact = {
            "model": model,
            "model_type": model.__class__.__name__,
            "feature_columns": FEATURE_COLUMNS,
            "training_records": training_records,
            "trained_at": datetime.now(UTC).isoformat(),
        }
        joblib.dump(model_artifact, models_dir / f"{product_id}.joblib")

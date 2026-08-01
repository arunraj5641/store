from collections.abc import Sequence
from datetime import date

import numpy as np
import pandas as pd

FEATURE_COLUMNS = [
    "day_number",
    "day_of_week",
    "is_weekend",
    "previous_day_sales",
    "rolling_7_day_average",
]
TARGET_COLUMN = "quantity_sold"


class SalesFeatureBuilder:
    def build_training_frame(self, sales_history: pd.DataFrame) -> pd.DataFrame:
        frame = self.prepare_sales_history(sales_history)
        frame["day_number"] = (frame["sale_date"] - frame["sale_date"].min()).dt.days
        frame["day_of_week"] = frame["sale_date"].dt.dayofweek
        frame["is_weekend"] = np.where(frame["day_of_week"].isin([5, 6]), 1, 0)
        frame["previous_day_sales"] = frame[TARGET_COLUMN].shift(1).fillna(0)
        frame["rolling_7_day_average"] = (
            frame[TARGET_COLUMN]
            .shift(1)
            .rolling(window=7, min_periods=1)
            .mean()
            .fillna(0)
        )

        return frame

    def split_features_and_target(
        self,
        sales_history: pd.DataFrame,
    ) -> tuple[pd.DataFrame, pd.Series]:
        training_frame = self.build_training_frame(sales_history)
        features = training_frame[FEATURE_COLUMNS].astype(float)
        target = training_frame[TARGET_COLUMN].astype(float)

        return features, target

    def build_prediction_features(
        self,
        first_sale_date: pd.Timestamp,
        prediction_date: date,
        prior_sales: Sequence[float],
    ) -> pd.DataFrame:
        prediction_timestamp = pd.Timestamp(prediction_date)
        day_of_week = prediction_timestamp.dayofweek
        recent_sales = list(prior_sales[-7:])

        features = {
            "day_number": (prediction_timestamp - first_sale_date).days,
            "day_of_week": day_of_week,
            "is_weekend": int(day_of_week in [5, 6]),
            "previous_day_sales": prior_sales[-1] if prior_sales else 0,
            "rolling_7_day_average": float(np.mean(recent_sales)) if recent_sales else 0,
        }

        return pd.DataFrame([features], columns=FEATURE_COLUMNS).astype(float)

    def prepare_sales_history(self, sales_history: pd.DataFrame) -> pd.DataFrame:
        frame = sales_history.copy()
        frame["sale_date"] = pd.to_datetime(frame["sale_date"], errors="coerce")
        frame[TARGET_COLUMN] = pd.to_numeric(frame[TARGET_COLUMN], errors="coerce")
        frame = frame.dropna(subset=["sale_date", TARGET_COLUMN])
        frame = (
            frame.groupby("sale_date", as_index=False)[TARGET_COLUMN]
            .sum()
            .sort_values("sale_date")
            .reset_index(drop=True)
        )

        return frame

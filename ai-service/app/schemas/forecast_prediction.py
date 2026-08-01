from datetime import date

from pydantic import BaseModel, ConfigDict, conint, confloat


class ForecastPrediction(BaseModel):
    model_config = ConfigDict(extra="forbid")

    date: date
    predicted_sales: conint(strict=True, ge=0)


class ProductForecastResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    product_id: conint(strict=True, gt=0)
    predictions: list[ForecastPrediction]
    average_daily_sales: confloat(strict=True, ge=0)
    total_predicted_sales: conint(strict=True, ge=0)

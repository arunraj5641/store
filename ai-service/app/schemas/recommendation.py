from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, conint

RecommendationPriority = Literal["low", "medium", "high", "urgent"]


class ProductRecommendationContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    product_id: conint(strict=True, gt=0)
    product_name: str = Field(min_length=1)
    category: str = Field(min_length=1)
    current_stock: conint(strict=True, ge=0)


class ForecastRecommendationContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    forecast_id: conint(strict=True, gt=0)
    predicted_demand: conint(strict=True, ge=0)
    forecast_date: date


class FestivalRecommendationContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    festival_name: str = Field(min_length=1)
    festival_date: date


class SalesSummaryContext(BaseModel):
    model_config = ConfigDict(extra="forbid")

    last_30_days: conint(strict=True, ge=0)
    last_90_days: conint(strict=True, ge=0)


class GenerateRecommendationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    product: ProductRecommendationContext
    forecast: ForecastRecommendationContext
    festival: FestivalRecommendationContext
    sales_summary: SalesSummaryContext


class GenerateRecommendationResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recommended_quantity: conint(strict=True, ge=0)
    priority: RecommendationPriority
    reason: str = Field(min_length=1)

"""Translate product forecasts into inventory replenishment decisions."""

from math import ceil

from pydantic import BaseModel, ConfigDict, Field

from app.core.config import Settings
from app.forecasting.predictor import ForecastPredictionError, ForecastPredictionService
from app.forecasting.rails_client import RailsProductClient, RailsProductClientError


class ReorderRecommendation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    product_id: int = Field(gt=0)
    current_stock: int = Field(ge=0)
    predicted_weekly_demand: int = Field(ge=0)
    average_daily_demand: float = Field(ge=0)
    lead_time_days: int = Field(ge=0)
    safety_stock: int = Field(ge=0)
    dynamic_reorder_level: int = Field(ge=0)
    recommended_order_quantity: int = Field(ge=0)
    inventory_risk: str
    reason: str


class ReorderRecommendationError(Exception):
    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ReorderEngine:
    """Owns all inventory decision calculations, independent of forecast model choice."""

    def __init__(self, lead_time_days: int, safety_stock_percentage: float) -> None:
        self._lead_time_days = lead_time_days
        self._safety_stock_percentage = safety_stock_percentage

    def recommend(
        self,
        product_id: int,
        current_stock: int,
        predicted_7_day_sales: int,
    ) -> ReorderRecommendation:
        average_daily_demand = predicted_7_day_sales / 7
        demand_during_lead_time = average_daily_demand * self._lead_time_days
        safety_stock = ceil(
            demand_during_lead_time * self._safety_stock_percentage / 100
        )
        dynamic_reorder_level = ceil(demand_during_lead_time + safety_stock)
        recommended_order_quantity = max(0, dynamic_reorder_level - current_stock)
        inventory_risk, reason = self._inventory_risk(
            current_stock=current_stock,
            demand_during_lead_time=demand_during_lead_time,
            dynamic_reorder_level=dynamic_reorder_level,
        )

        return ReorderRecommendation(
            product_id=product_id,
            current_stock=current_stock,
            predicted_weekly_demand=predicted_7_day_sales,
            average_daily_demand=average_daily_demand,
            lead_time_days=self._lead_time_days,
            safety_stock=safety_stock,
            dynamic_reorder_level=dynamic_reorder_level,
            recommended_order_quantity=recommended_order_quantity,
            inventory_risk=inventory_risk,
            reason=reason,
        )

    @staticmethod
    def _inventory_risk(
        current_stock: int,
        demand_during_lead_time: float,
        dynamic_reorder_level: int,
    ) -> tuple[str, str]:
        if current_stock <= demand_during_lead_time:
            return "HIGH", "Predicted demand during supplier lead time exceeds available inventory."
        if current_stock <= dynamic_reorder_level:
            return "MEDIUM", "Available inventory is at or below the dynamic reorder level."
        return "LOW", "Available inventory exceeds the dynamic reorder level."


class ReorderRecommendationService:
    """Coordinates forecast retrieval, stock retrieval, and the reorder decision."""

    def __init__(
        self,
        prediction_service: ForecastPredictionService,
        product_client: RailsProductClient,
        settings: Settings,
    ) -> None:
        self._prediction_service = prediction_service
        self._product_client = product_client
        self._engine = ReorderEngine(
            lead_time_days=settings.forecast_reorder_lead_time_days,
            safety_stock_percentage=settings.forecast_reorder_safety_stock_percentage,
        )

    async def recommend(
        self,
        product_id: int,
        authorization_header: str | None = None,
    ) -> ReorderRecommendation:
        try:
            current_stock = await self._product_client.fetch_current_stock(
                product_id=product_id,
                authorization_header=authorization_header,
            )
            forecast = await self._prediction_service.predict(
                product_id=product_id,
                authorization_header=authorization_header,
            )
        except (RailsProductClientError, ForecastPredictionError) as error:
            raise ReorderRecommendationError(error.message, error.status_code) from error

        return self._engine.recommend(
            product_id=product_id,
            current_stock=current_stock,
            predicted_7_day_sales=forecast.total_predicted_sales,
        )

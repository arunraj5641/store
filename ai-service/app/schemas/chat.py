from datetime import date

from pydantic import BaseModel, Field


class LowStockProduct(BaseModel):
    product_id: int
    product_name: str
    category: str
    current_stock: int
    reorder_threshold: int


class HighPriorityRecommendation(BaseModel):
    recommendation_id: int
    product_id: int
    recommended_quantity: int
    priority: str
    status: str


class UpcomingFestival(BaseModel):
    festival_id: int
    festival_name: str
    festival_date: date
    season: str


class ProductSalesRanking(BaseModel):
    product_id: int
    product_name: str
    category: str
    quantity_sold: int
    period_days: int


class HighDemandForecast(BaseModel):
    forecast_id: int
    product_id: int
    product_name: str
    predicted_demand: int
    forecast_date: date
    festival_id: int
    festival_name: str


class StoreData(BaseModel):
    low_stock_products: list[LowStockProduct] = Field(default_factory=list)
    high_priority_recommendations: list[HighPriorityRecommendation] = Field(
        default_factory=list,
    )
    upcoming_festivals: list[UpcomingFestival] = Field(default_factory=list)
    top_selling_products_last_30_days: list[ProductSalesRanking] = Field(
        default_factory=list,
    )
    lowest_selling_products_last_30_days: list[ProductSalesRanking] = Field(
        default_factory=list,
    )
    highest_demand_forecasts: list[HighDemandForecast] = Field(default_factory=list)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    store_data: StoreData


class ChatResponse(BaseModel):
    response: str

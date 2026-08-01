class ForecastCacheService
  def initialize(forecast_service: ForecastService.new)
    @forecast_service = forecast_service
  end

  def fetch_or_refresh(product:, authorization:, refresh: false)
    return product.ai_forecast if product.ai_forecast.present? && !refresh

    refresh!(product: product, authorization: authorization)
  end

  private

  def refresh!(product:, authorization:)
    ai_forecast = @forecast_service.forecast(
      product_id: product.product_id,
      authorization: authorization
    )
    ai_reorder = @forecast_service.reorder(
      product_id: product.product_id,
      authorization: authorization
    )

    cached_forecast = product.ai_forecast || product.build_ai_forecast
    cached_forecast.assign_attributes(
      predicted_weekly_demand: ai_forecast.fetch(:total_predicted_sales),
      average_daily_demand: ai_forecast.fetch(:average_daily_sales),
      dynamic_reorder_level: ai_reorder.fetch(:dynamic_reorder_level),
      recommended_order_quantity: ai_reorder.fetch(:recommended_order_quantity),
      inventory_risk: ai_reorder.fetch(:inventory_risk),
      forecast_generated_at: Time.current
    )
    cached_forecast.save!
    AiForecastAlertService.new.generate(product: product, forecast: cached_forecast)
    cached_forecast
  end
end

class AiForecastAlertService
  def generate(product:, forecast:)
    create_forecast_generated_alert(product, forecast)
    create_reorder_alert(product, forecast) if forecast.recommended_order_quantity.positive?
    create_high_risk_alert(product, forecast) if forecast.inventory_risk == "HIGH"
  end

  private

  def create_forecast_generated_alert(product, forecast)
    create_notification(
      product,
      "AI forecast generated for #{product.product_name}: " \
      "#{forecast.predicted_weekly_demand} units predicted for the next 7 days."
    )
  end

  def create_reorder_alert(product, forecast)
    create_notification(
      product,
      "AI recommends reordering #{forecast.recommended_order_quantity} units of " \
      "#{product.product_name}."
    )
  end

  def create_high_risk_alert(product, forecast)
    create_notification(
      product,
      "High inventory risk for #{product.product_name}: current stock is at or below " \
      "the AI dynamic reorder level of #{forecast.dynamic_reorder_level}."
    )
  end

  def create_notification(product, message)
    product.user.notifications.create!(message: message)
  end
end

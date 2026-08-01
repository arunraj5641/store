class AiForecastSerializer < ApplicationSerializer
  private

  def attributes
    {
      product_id: record.product_id,
      predicted_weekly_demand: record.predicted_weekly_demand,
      average_daily_sales: record.average_daily_demand,
      total_predicted_sales: record.predicted_weekly_demand,
      forecast_generated_at: record.forecast_generated_at
    }
  end
end

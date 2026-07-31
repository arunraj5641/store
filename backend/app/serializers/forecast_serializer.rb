class ForecastSerializer < ApplicationSerializer
  private

  def attributes
    {
      forecast_id: record.forecast_id,
      product_id: record.product_id,
      festival_id: record.festival_id,
      forecast_date: record.forecast_date,
      predicted_demand: record.predicted_demand
    }
  end
end

class RecommendationSerializer < ApplicationSerializer
  private

  def attributes
    {
      recommendation_id: record.recommendation_id,
      forecast_id: record.forecast_id,
      product_id: record.forecast.product_id,
      recommended_quantity: record.recommended_quantity,
      priority: record.priority,
      status: record.status,
      reason: recommendation_reason,
      created_at: record.created_at,
      updated_at: record.updated_at
    }
  end

  def recommendation_reason
    record.has_attribute?(:reason) ? record.reason : nil
  end
end

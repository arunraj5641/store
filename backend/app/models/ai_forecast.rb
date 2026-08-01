class AiForecast < ApplicationRecord
  belongs_to :product,
             foreign_key: :product_id,
             primary_key: :product_id

  validates :predicted_weekly_demand,
            :dynamic_reorder_level,
            :recommended_order_quantity,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :average_daily_demand, numericality: { greater_than_or_equal_to: 0 }
  validates :inventory_risk, inclusion: { in: %w[HIGH MEDIUM LOW] }
  validates :forecast_generated_at, presence: true
end

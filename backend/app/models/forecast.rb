class Forecast < ApplicationRecord
  self.primary_key = "forecast_id"

  belongs_to :product,
             foreign_key: :product_id,
             primary_key: :product_id

  belongs_to :festival,
             foreign_key: :festival_id,
             primary_key: :festival_id

  has_many :recommendations,
           foreign_key: :forecast_id,
           primary_key: :forecast_id,
           dependent: :destroy

  validates :forecast_date, presence: true
  validates :predicted_demand,
            presence: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :latest, -> { order(forecast_date: :desc) }
end

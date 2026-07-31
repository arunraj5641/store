class Recommendation < ApplicationRecord
  self.primary_key = "recommendation_id"

  enum :priority, {
    low: "low",
    medium: "medium",
    high: "high",
    urgent: "urgent"
  }, validate: true

  enum :status, {
    pending: "pending",
    approved: "approved",
    completed: "completed",
    dismissed: "dismissed"
  }, validate: true

  belongs_to :forecast,
             foreign_key: :forecast_id,
             primary_key: :forecast_id

  belongs_to :product,
             foreign_key: :product_id,
             primary_key: :product_id

  has_many :notifications,
           foreign_key: :recommendation_id,
           primary_key: :recommendation_id,
           dependent: :destroy

  validates :recommended_quantity,
            presence: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :priority, presence: true
  validates :status, presence: true

  scope :high_priority, -> { where(priority: priorities[:high]) }
end

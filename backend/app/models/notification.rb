class Notification < ApplicationRecord
  self.primary_key = "notification_id"

  belongs_to :user,
             foreign_key: :user_id,
             primary_key: :user_id

  belongs_to :recommendation,
             foreign_key: :recommendation_id,
             primary_key: :recommendation_id

  validates :message, presence: true

  scope :unread, -> { where(is_read: false) }
end

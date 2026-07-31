class User < ApplicationRecord
  self.primary_key = "user_id"

  has_many :products,
           foreign_key: :user_id,
           primary_key: :user_id,
           dependent: :destroy

  has_many :notifications,
           foreign_key: :user_id,
           primary_key: :user_id,
           dependent: :destroy

  validates :name, presence: true
  validates :email,
            presence: true,
            uniqueness: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :shop_name, presence: true
end

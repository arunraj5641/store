class User < ApplicationRecord
  self.primary_key = "user_id"

  has_secure_password

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
  validates :password,
            length: { minimum: 8 },
            if: -> { password.present? }
  validates :password_confirmation,
            presence: true,
            if: :password_required?
  validates :shop_name, presence: true

  private

  def password_required?
    new_record? || password.present?
  end
end

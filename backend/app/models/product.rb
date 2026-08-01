class Product < ApplicationRecord
  self.primary_key = "product_id"

  belongs_to :user,
             foreign_key: :user_id,
             primary_key: :user_id

  has_many :sales_histories,
           foreign_key: :product_id,
           primary_key: :product_id,
           dependent: :destroy

  has_many :forecasts,
           foreign_key: :product_id,
           primary_key: :product_id,
           dependent: :destroy

  has_many :recommendations,
           foreign_key: :product_id,
           primary_key: :product_id,
           dependent: :destroy

  has_one :ai_forecast,
          foreign_key: :product_id,
          primary_key: :product_id,
          dependent: :destroy

  validates :product_name, presence: true
  validates :category, presence: true
  validates :current_stock,
            presence: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :reorder_threshold,
            presence: true,
            numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :low_stock, -> { where("current_stock <= reorder_threshold") }
end

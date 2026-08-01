class SalesHistory < ApplicationRecord
  alias_method :sales_id, :id

  belongs_to :product,
             foreign_key: :product_id,
             primary_key: :product_id

  validates :sale_date, presence: true
  validates :quantity_sold,
            presence: true,
            numericality: { only_integer: true, greater_than: 0 }

  scope :recent, -> { order(sale_date: :desc) }
end

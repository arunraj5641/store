class SalesHistorySerializer < ApplicationSerializer
  private

  def attributes
    {
      id: record.id,
      sales_id: record.id,
      product_id: record.product_id,
      sale_date: record.sale_date,
      quantity_sold: record.quantity_sold
    }
  end
end

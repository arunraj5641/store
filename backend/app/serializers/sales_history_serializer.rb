class SalesHistorySerializer < ApplicationSerializer
  private

  def attributes
    {
      sales_id: record.sales_id,
      product_id: record.product_id,
      sale_date: record.sale_date,
      quantity_sold: record.quantity_sold
    }
  end
end

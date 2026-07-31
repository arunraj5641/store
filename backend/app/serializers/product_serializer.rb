class ProductSerializer < ApplicationSerializer
  private

  def attributes
    {
      product_id: record.product_id,
      product_name: record.product_name,
      category: record.category,
      current_stock: record.current_stock,
      reorder_threshold: record.reorder_threshold
    }
  end
end

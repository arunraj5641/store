class AiReorderSerializer < ApplicationSerializer
  private

  def attributes
    {
      product_id: record.product_id,
      current_stock: record.product.current_stock,
      dynamic_reorder_level: record.dynamic_reorder_level,
      recommended_order_quantity: record.recommended_order_quantity,
      inventory_risk: record.inventory_risk,
      explanation: "Cached AI inventory reorder recommendation."
    }
  end
end

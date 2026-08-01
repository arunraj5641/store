class CreateSalesHistories < ActiveRecord::Migration[8.1]
  def change
    create_table :sales_histories do |t|
      t.bigint :product_id, null: false
      t.date :sale_date, null: false
      t.integer :quantity_sold, null: false

      t.timestamps null: false
    end

    add_index :sales_histories, :product_id
    add_foreign_key :sales_histories, :products, column: :product_id, primary_key: :product_id
  end
end

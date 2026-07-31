class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products, primary_key: :product_id do |t|
      t.bigint :user_id, null: false
      t.string :product_name, null: false
      t.string :category, null: false
      t.integer :current_stock, null: false
      t.integer :reorder_threshold, null: false

      t.timestamps null: false
    end

    add_index :products, :user_id
    add_foreign_key :products, :users, column: :user_id, primary_key: :user_id
  end
end

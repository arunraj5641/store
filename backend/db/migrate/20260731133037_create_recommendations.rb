class CreateRecommendations < ActiveRecord::Migration[8.1]
  def change
    create_table :recommendations, primary_key: :recommendation_id do |t|
      t.bigint :forecast_id, null: false
      t.bigint :product_id, null: false
      t.integer :recommended_quantity, null: false
      t.string :priority, null: false
      t.string :status, null: false

      t.timestamps null: false
    end

    add_index :recommendations, :forecast_id
    add_index :recommendations, :product_id
    add_foreign_key :recommendations, :forecasts, column: :forecast_id, primary_key: :forecast_id
    add_foreign_key :recommendations, :products, column: :product_id, primary_key: :product_id
  end
end

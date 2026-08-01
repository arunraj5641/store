class CreateAiForecasts < ActiveRecord::Migration[8.1]
  def change
    create_table :ai_forecasts do |t|
      t.bigint :product_id, null: false
      t.integer :predicted_weekly_demand, null: false
      t.decimal :average_daily_demand, precision: 10, scale: 2, null: false
      t.integer :dynamic_reorder_level, null: false
      t.integer :recommended_order_quantity, null: false
      t.string :inventory_risk, null: false
      t.datetime :forecast_generated_at, null: false

      t.timestamps
    end

    add_index :ai_forecasts, :product_id, unique: true
    add_foreign_key :ai_forecasts, :products, column: :product_id, primary_key: :product_id
  end
end

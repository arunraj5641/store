class CreateForecasts < ActiveRecord::Migration[8.1]
  def change
    create_table :forecasts, primary_key: :forecast_id do |t|
      t.bigint :product_id, null: false
      t.bigint :festival_id, null: false
      t.date :forecast_date, null: false
      t.integer :predicted_demand, null: false

      t.timestamps null: false
    end

    add_index :forecasts, :product_id
    add_index :forecasts, :festival_id
    add_foreign_key :forecasts, :products, column: :product_id, primary_key: :product_id
    add_foreign_key :forecasts, :festivals, column: :festival_id, primary_key: :festival_id
  end
end

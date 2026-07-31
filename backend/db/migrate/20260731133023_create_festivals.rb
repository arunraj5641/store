class CreateFestivals < ActiveRecord::Migration[8.1]
  def change
    create_table :festivals, primary_key: :festival_id do |t|
      t.string :festival_name, null: false
      t.date :festival_date, null: false
      t.string :season, null: false

      t.timestamps null: false
    end
  end
end

class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users, primary_key: :user_id do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :shop_name, null: false

      t.timestamps null: false
    end

    add_index :users, :email, unique: true
  end
end

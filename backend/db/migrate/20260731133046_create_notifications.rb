class CreateNotifications < ActiveRecord::Migration[8.1]
  def change
    create_table :notifications, primary_key: :notification_id do |t|
      t.bigint :user_id, null: false
      t.bigint :recommendation_id, null: false
      t.string :message, null: false
      t.boolean :is_read, null: false, default: false

      t.timestamps null: false
    end

    add_index :notifications, :user_id
    add_index :notifications, :recommendation_id
    add_foreign_key :notifications, :users, column: :user_id, primary_key: :user_id
    add_foreign_key :notifications, :recommendations, column: :recommendation_id, primary_key: :recommendation_id
  end
end

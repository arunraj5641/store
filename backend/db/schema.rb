# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_08_01_110000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "ai_forecasts", force: :cascade do |t|
    t.decimal "average_daily_demand", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.integer "dynamic_reorder_level", null: false
    t.datetime "forecast_generated_at", null: false
    t.string "inventory_risk", null: false
    t.integer "predicted_weekly_demand", null: false
    t.bigint "product_id", null: false
    t.integer "recommended_order_quantity", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_ai_forecasts_on_product_id", unique: true
  end

  create_table "festivals", primary_key: "festival_id", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "festival_date", null: false
    t.string "festival_name", null: false
    t.string "season", null: false
    t.datetime "updated_at", null: false
  end

  create_table "forecasts", primary_key: "forecast_id", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "festival_id", null: false
    t.date "forecast_date", null: false
    t.integer "predicted_demand", null: false
    t.bigint "product_id", null: false
    t.datetime "updated_at", null: false
    t.index ["festival_id"], name: "index_forecasts_on_festival_id"
    t.index ["product_id"], name: "index_forecasts_on_product_id"
  end

  create_table "notifications", primary_key: "notification_id", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "is_read", default: false, null: false
    t.string "message", null: false
    t.bigint "recommendation_id"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["recommendation_id"], name: "index_notifications_on_recommendation_id"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "products", primary_key: "product_id", force: :cascade do |t|
    t.string "category", null: false
    t.datetime "created_at", null: false
    t.integer "current_stock", null: false
    t.string "product_name", null: false
    t.integer "reorder_threshold", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "recommendations", primary_key: "recommendation_id", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "forecast_id", null: false
    t.string "priority", null: false
    t.bigint "product_id", null: false
    t.integer "recommended_quantity", null: false
    t.string "status", null: false
    t.datetime "updated_at", null: false
    t.index ["forecast_id"], name: "index_recommendations_on_forecast_id"
    t.index ["product_id"], name: "index_recommendations_on_product_id"
  end

  create_table "sales_histories", id: :bigint, default: -> { "nextval('sales_histories_sales_id_seq'::regclass)" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "product_id", null: false
    t.integer "quantity_sold", null: false
    t.date "sale_date", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_sales_histories_on_product_id"
  end

  create_table "users", primary_key: "user_id", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.string "shop_name", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "ai_forecasts", "products", primary_key: "product_id"
  add_foreign_key "forecasts", "festivals", primary_key: "festival_id"
  add_foreign_key "forecasts", "products", primary_key: "product_id"
  add_foreign_key "notifications", "recommendations", primary_key: "recommendation_id"
  add_foreign_key "notifications", "users", primary_key: "user_id"
  add_foreign_key "products", "users", primary_key: "user_id"
  add_foreign_key "recommendations", "forecasts", primary_key: "forecast_id"
  add_foreign_key "recommendations", "products", primary_key: "product_id"
  add_foreign_key "sales_histories", "products", primary_key: "product_id"
end

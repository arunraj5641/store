unless Rails.env.development?
  puts "Seeds are limited to the development environment."
  return
end

demo_user = User.find_or_initialize_by(email: "demo@kirana.com")
demo_user.assign_attributes(
  name: "Asha Sharma",
  shop_name: "Asha Kirana Store",
  password: "password123",
  password_confirmation: "password123"
)
demo_user.save!

product_data = [
  ["Basmati Rice 5kg", "Grains", 42, 15],
  ["Sona Masoori Rice 5kg", "Grains", 30, 12],
  ["Whole Wheat Flour 5kg", "Grains", 18, 12],
  ["Sugar 1kg", "Staples", 55, 20],
  ["Iodized Salt 1kg", "Staples", 65, 20],
  ["Sunflower Cooking Oil 1L", "Cooking Oil", 9, 18],
  ["Amul Toned Milk 1L", "Dairy", 12, 20],
  ["Farm Fresh Eggs (12)", "Dairy", 24, 15],
  ["Tata Tea Gold 500g", "Beverages", 16, 10],
  ["Nescafe Classic Coffee 100g", "Beverages", 8, 8],
  ["Parle-G Biscuits 800g", "Snacks", 48, 18],
  ["Britannia Bread", "Bakery", 14, 10],
  ["Dettol Bath Soap 125g", "Personal Care", 36, 12],
  ["Surf Excel Detergent 1kg", "Household", 20, 10],
  ["Coca-Cola 750ml", "Soft Drinks", 28, 15],
  ["Tropicana Orange Juice 1L", "Beverages", 11, 10],
  ["Toor Dal 1kg", "Pulses", 25, 12],
  ["Maggi Noodles Pack", "Snacks", 60, 25]
].map do |name, category, stock, threshold|
  demo_user.products.find_or_create_by!(product_name: name) do |product|
    product.category = category
    product.current_stock = stock
    product.reorder_threshold = threshold
  end
end

product_data.each_with_index do |product, product_index|
  90.times do |days_ago|
    sale_date = days_ago.days.ago.to_date
    product.sales_histories.find_or_create_by!(sale_date: sale_date) do |sale|
      sale.quantity_sold = 2 + ((product_index * 7 + days_ago * 3) % 12)
    end
  end
end

festival_data = [
  ["Onam", Date.new(2026, 8, 26), "Monsoon"],
  ["Ganesh Chaturthi", Date.new(2026, 9, 14), "Autumn"],
  ["Dussehra", Date.new(2026, 10, 20), "Autumn"],
  ["Diwali", Date.new(2026, 11, 8), "Autumn"],
  ["Christmas", Date.new(2026, 12, 25), "Winter"],
  ["Pongal", Date.new(2027, 1, 15), "Winter"],
  ["Holi", Date.new(2027, 3, 4), "Spring"],
  ["Eid al-Fitr", Date.new(2027, 3, 10), "Spring"]
].map do |name, date, season|
  Festival.find_or_create_by!(festival_name: name) do |festival|
    festival.festival_date = date
    festival.season = season
  end
end

festival_data.each_with_index do |festival, festival_index|
  product_data.first(8).each_with_index do |product, product_index|
    Forecast.find_or_create_by!(
      product: product,
      festival: festival,
      forecast_date: festival.festival_date - 7.days
    ) do |forecast|
      forecast.predicted_demand = 18 + ((product_index + 1) * 6) + (festival_index * 3)
    end
  end
end

puts "Seeded #{demo_user.email}: #{product_data.size} products, #{SalesHistory.where(product: product_data).count} sales, #{festival_data.size} festivals, and #{Forecast.where(product: product_data).count} forecasts."

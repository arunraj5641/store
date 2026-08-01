class AllowAiForecastNotificationsWithoutRecommendation < ActiveRecord::Migration[8.1]
  def change
    change_column_null :notifications, :recommendation_id, true
  end
end

module Api
  module V1
    class AiController < BaseController
      before_action :authenticate_user!

      def chat
        message = chat_params[:message].to_s.strip

        if message.blank?
          return render_validation_error(
            errors: { message: ["can't be blank"] }
          )
        end

        ai_response = AiChatClient.new.chat(
          message: message,
          store_data: store_data
        )

        render_success(
          message: "AI chat response generated successfully.",
          data: { reply: ai_response.fetch(:reply) }
        )
      rescue AiChatClient::Error => error
        render_error(message: error.message, status: error.status, errors: error.details)
      end

      private

      def chat_params
        params.permit(:message)
      end

      def store_data
        {
          low_stock_products: low_stock_products,
          high_priority_recommendations: high_priority_recommendations,
          upcoming_festivals: upcoming_festivals,
          top_selling_products_last_30_days: top_selling_products_last_30_days,
          lowest_selling_products_last_30_days: lowest_selling_products_last_30_days,
          highest_demand_forecasts: highest_demand_forecasts
        }
      end

      def low_stock_products
        current_user.products
                    .low_stock
                    .order(product_id: :asc)
                    .map do |product|
          {
            product_id: product.product_id,
            product_name: product.product_name,
            category: product.category,
            current_stock: product.current_stock,
            reorder_threshold: product.reorder_threshold
          }
        end
      end

      def high_priority_recommendations
        Recommendation.high_priority
                      .where(product_id: current_user.products.select(:product_id))
                      .order(recommendation_id: :asc)
                      .map do |recommendation|
          {
            recommendation_id: recommendation.recommendation_id,
            product_id: recommendation.product_id,
            recommended_quantity: recommendation.recommended_quantity,
            priority: recommendation.priority,
            status: recommendation.status
          }
        end
      end

      def top_selling_products_last_30_days
        product_sales_rankings.sort_by { |product| [-product[:quantity_sold], product[:product_name]] }
      end

      def lowest_selling_products_last_30_days
        product_sales_rankings.sort_by { |product| [product[:quantity_sold], product[:product_name]] }
      end

      def product_sales_rankings
        @product_sales_rankings ||= begin
          products = current_user.products
                                 .select(:product_id, :product_name, :category)
                                 .order(product_id: :asc)
                                 .to_a
          sales_totals = SalesHistory.where(product_id: products.map(&:product_id))
                                     .where("sale_date >= ?", 30.days.ago.to_date)
                                     .group(:product_id)
                                     .sum(:quantity_sold)

          products.map do |product|
            {
              product_id: product.product_id,
              product_name: product.product_name,
              category: product.category,
              quantity_sold: sales_totals.fetch(product.product_id, 0).to_i,
              period_days: 30
            }
          end
        end
      end

      def highest_demand_forecasts
        Forecast.where(product_id: current_user.products.select(:product_id))
                .includes(:product, :festival)
                .order(predicted_demand: :desc, forecast_id: :asc)
                .map do |forecast|
          {
            forecast_id: forecast.forecast_id,
            product_id: forecast.product_id,
            product_name: forecast.product.product_name,
            predicted_demand: forecast.predicted_demand,
            forecast_date: forecast.forecast_date.iso8601,
            festival_id: forecast.festival_id,
            festival_name: forecast.festival.festival_name
          }
        end
      end

      def upcoming_festivals
        Festival.upcoming.order(festival_date: :asc, festival_id: :asc).map do |festival|
          {
            festival_id: festival.festival_id,
            festival_name: festival.festival_name,
            festival_date: festival.festival_date.iso8601,
            season: festival.season
          }
        end
      end
    end
  end
end

module Api
  module V1
    class RecommendationsController < BaseController
      before_action :authenticate_user!
      before_action :set_recommendation, only: %i[show update destroy]

      def index
        page, per_page = pagination_params
        recommendations = filtered_recommendations
        total = recommendations.count
        recommendations = recommendations
                          .includes(:forecast)
                          .order(created_at: :desc, recommendation_id: :desc)
                          .offset((page - 1) * per_page)
                          .limit(per_page)

        render_success(
          message: "Recommendations fetched successfully.",
          data: { recommendations: recommendations.map { |recommendation| serialize_recommendation(recommendation) } },
          meta: pagination_meta(page: page, per_page: per_page, total: total)
        )
      end

      def show
        render_success(
          message: "Recommendation fetched successfully.",
          data: { recommendation: serialize_recommendation(@recommendation) }
        )
      end

      def create
        forecast = owned_forecasts.find(create_recommendation_params[:forecast_id])
        recommendation = build_recommendation_for_forecast(
          forecast,
          create_recommendation_params.except(:forecast_id)
        )

        return render_validation_error(errors: recommendation) unless recommendation.save

        render_created(
          message: "Recommendation created successfully.",
          data: { recommendation: serialize_recommendation(recommendation) }
        )
      end

      def generate
        forecast = owned_forecasts.includes(:product, :festival).find(generate_recommendation_params[:forecast_id])
        ai_recommendation = AiRecommendationClient.new.generate(ai_recommendation_payload(forecast))
        recommendation = build_recommendation_for_forecast(
          forecast,
          ai_recommendation_attributes(ai_recommendation)
        )

        return render_validation_error(errors: recommendation) unless recommendation.save

        render_created(
          message: "AI recommendation generated successfully.",
          data: {
            recommendation: serialize_recommendation(recommendation),
            ai_recommendation: ai_recommendation
          }
        )
      rescue AiRecommendationClient::Error => error
        render_error(message: error.message, status: error.status, errors: error.details)
      end

      def update
        return render_validation_error(errors: @recommendation) unless @recommendation.update(update_recommendation_params)

        render_success(
          message: "Recommendation updated successfully.",
          data: { recommendation: serialize_recommendation(@recommendation) }
        )
      end

      def destroy
        @recommendation.destroy!

        render_success(message: "Recommendation deleted successfully.", data: {})
      end

      private

      def set_recommendation
        @recommendation = recommendations_scope.includes(:forecast).find(params[:id])
      end

      def owned_forecasts
        Forecast.where(product_id: current_user.products.select(:product_id))
      end

      def recommendations_scope
        Recommendation.joins(:forecast).where(forecasts: { product_id: current_user.products.select(:product_id) })
      end

      def filtered_recommendations
        recommendations = recommendations_scope
        recommendations = recommendations.where(forecasts: { product_id: params[:product_id] }) if params[:product_id].present?
        recommendations = recommendations.where(forecast_id: params[:forecast_id]) if params[:forecast_id].present?
        recommendations = recommendations.where(priority: params[:priority].to_s.strip) if params[:priority].present?
        recommendations = recommendations.where(status: params[:status].to_s.strip) if params[:status].present?
        recommendations
      end

      def create_recommendation_params
        params.require(:recommendation).permit(*create_recommendation_attributes)
      end

      def update_recommendation_params
        params.require(:recommendation).permit(*update_recommendation_attributes)
      end

      def generate_recommendation_params
        params.require(:recommendation).permit(:forecast_id)
      end

      def create_recommendation_attributes
        [:forecast_id, *update_recommendation_attributes]
      end

      def update_recommendation_attributes
        attributes = %i[recommended_quantity priority status]
        attributes << :reason if Recommendation.attribute_names.include?("reason")
        attributes
      end

      def pagination_params
        page = params[:page].to_i
        per_page = params[:per_page].to_i

        [page.positive? ? page : 1, per_page.between?(1, 100) ? per_page : 20]
      end

      def serialize_recommendation(recommendation)
        RecommendationSerializer.new(recommendation).as_json
      end

      def build_recommendation_for_forecast(forecast, attributes)
        forecast.recommendations.build(attributes.merge(product_id: forecast.product_id))
      end

      def ai_recommendation_payload(forecast)
        product = forecast.product
        festival = forecast.festival

        {
          product: {
            product_id: product.product_id,
            product_name: product.product_name,
            category: product.category,
            current_stock: product.current_stock
          },
          forecast: {
            forecast_id: forecast.forecast_id,
            predicted_demand: forecast.predicted_demand,
            forecast_date: forecast.forecast_date.iso8601
          },
          festival: {
            festival_name: festival.festival_name,
            festival_date: festival.festival_date.iso8601
          },
          sales_summary: sales_summary_for(product)
        }
      end

      def sales_summary_for(product)
        {
          last_30_days: sales_quantity_since(product, 30.days.ago.to_date),
          last_90_days: sales_quantity_since(product, 90.days.ago.to_date)
        }
      end

      def sales_quantity_since(product, date)
        product.sales_histories.where("sale_date >= ?", date).sum(:quantity_sold).to_i
      end

      def ai_recommendation_attributes(ai_recommendation)
        attributes = {
          recommended_quantity: ai_recommendation.fetch(:recommended_quantity),
          priority: ai_recommendation.fetch(:priority),
          status: Recommendation.statuses.fetch("pending")
        }
        attributes[:reason] = ai_recommendation[:reason] if Recommendation.attribute_names.include?("reason")
        attributes
      end
    end
  end
end

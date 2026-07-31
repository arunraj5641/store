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
        recommendation = forecast.recommendations.build(
          create_recommendation_params.except(:forecast_id).merge(product_id: forecast.product_id)
        )

        return render_validation_error(errors: recommendation) unless recommendation.save

        render_created(
          message: "Recommendation created successfully.",
          data: { recommendation: serialize_recommendation(recommendation) }
        )
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
    end
  end
end

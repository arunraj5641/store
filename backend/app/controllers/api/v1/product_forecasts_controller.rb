module Api
  module V1
    class ProductForecastsController < BaseController
      before_action :authenticate_user!
      before_action :set_product

      def forecast
        forecast = forecast_cache_service.fetch_or_refresh(
          product: @product,
          authorization: request.headers["Authorization"],
          refresh: refresh_requested?
        )

        render_success(
          message: "Cached AI forecast fetched successfully.",
          data: { forecast: AiForecastSerializer.new(forecast).as_json }
        )
      rescue ForecastService::Error => error
        render_error(message: error.message, status: error.status, errors: error.details)
      rescue ActiveRecord::RecordInvalid => error
        render_validation_error(errors: error.record)
      end

      def reorder
        forecast = forecast_cache_service.fetch_or_refresh(
          product: @product,
          authorization: request.headers["Authorization"],
          refresh: refresh_requested?
        )

        render_success(
          message: "Cached AI reorder recommendation fetched successfully.",
          data: { reorder: AiReorderSerializer.new(forecast).as_json }
        )
      rescue ForecastService::Error => error
        render_error(message: error.message, status: error.status, errors: error.details)
      rescue ActiveRecord::RecordInvalid => error
        render_validation_error(errors: error.record)
      end

      private

      def set_product
        @product = current_user.products.find(params[:id])
      end

      def forecast_cache_service
        @forecast_cache_service ||= ForecastCacheService.new
      end

      def refresh_requested?
        ActiveModel::Type::Boolean.new.cast(forecast_request_params[:refresh])
      end

      def forecast_request_params
        params.permit(:refresh)
      end
    end
  end
end

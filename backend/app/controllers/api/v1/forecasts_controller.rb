module Api
  module V1
    class ForecastsController < BaseController
      before_action :authenticate_user!
      before_action :set_forecast, only: %i[show update destroy]

      def index
        page, per_page = pagination_params
        forecasts = filtered_forecasts
        total = forecasts.count
        forecasts = forecasts.latest.offset((page - 1) * per_page).limit(per_page)

        render_success(
          message: "Forecasts fetched successfully.",
          data: { forecasts: forecasts.map { |forecast| serialize_forecast(forecast) } },
          meta: pagination_meta(page: page, per_page: per_page, total: total)
        )
      end

      def show
        render_success(
          message: "Forecast fetched successfully.",
          data: { forecast: serialize_forecast(@forecast) }
        )
      end

      def create
        product = current_user.products.find(create_forecast_params[:product_id])
        Festival.find(create_forecast_params[:festival_id])
        forecast = product.forecasts.build(create_forecast_params.except(:product_id))

        return render_validation_error(errors: forecast) unless forecast.save

        render_created(
          message: "Forecast created successfully.",
          data: { forecast: serialize_forecast(forecast) }
        )
      end

      def update
        Festival.find(update_forecast_params[:festival_id]) if update_forecast_params[:festival_id].present?

        return render_validation_error(errors: @forecast) unless @forecast.update(update_forecast_params)

        render_success(
          message: "Forecast updated successfully.",
          data: { forecast: serialize_forecast(@forecast) }
        )
      end

      def destroy
        @forecast.destroy!

        render_success(message: "Forecast deleted successfully.", data: {})
      end

      private

      def set_forecast
        @forecast = Forecast.where(product_id: current_user.products.select(:product_id)).find(params[:id])
      end

      def create_forecast_params
        params.require(:forecast).permit(:product_id, :festival_id, :forecast_date, :predicted_demand)
      end

      def update_forecast_params
        params.require(:forecast).permit(:festival_id, :forecast_date, :predicted_demand)
      end

      def filtered_forecasts
        forecasts = Forecast.where(product_id: current_user.products.select(:product_id))
        forecasts = forecasts.where(product_id: params[:product_id]) if params[:product_id].present?
        forecasts = forecasts.where(festival_id: params[:festival_id]) if params[:festival_id].present?
        forecasts
      end

      def pagination_params
        page = params[:page].to_i
        per_page = params[:per_page].to_i

        [page.positive? ? page : 1, per_page.between?(1, 100) ? per_page : 20]
      end

      def serialize_forecast(forecast)
        ForecastSerializer.new(forecast).as_json
      end
    end
  end
end

module Api
  module V1
    class FestivalsController < BaseController
      before_action :authenticate_user!
      before_action :set_festival, only: %i[show update destroy]

      def index
        page, per_page = pagination_params
        festivals = filtered_festivals
        total = festivals.count
        festivals = festivals.order(festival_date: :asc).offset((page - 1) * per_page).limit(per_page)

        render_success(
          message: "Festivals fetched successfully.",
          data: { festivals: festivals.map { |festival| serialize_festival(festival) } },
          meta: pagination_meta(page: page, per_page: per_page, total: total)
        )
      end

      def show
        render_success(
          message: "Festival fetched successfully.",
          data: { festival: serialize_festival(@festival) }
        )
      end

      def create
        festival = Festival.new(festival_params)

        return render_validation_error(errors: festival) unless festival.save

        render_created(
          message: "Festival created successfully.",
          data: { festival: serialize_festival(festival) }
        )
      end

      def update
        return render_validation_error(errors: @festival) unless @festival.update(festival_params)

        render_success(
          message: "Festival updated successfully.",
          data: { festival: serialize_festival(@festival) }
        )
      end

      def destroy
        @festival.destroy!

        render_success(message: "Festival deleted successfully.", data: {})
      end

      private

      def set_festival
        @festival = Festival.find(params[:id])
      end

      def festival_params
        params.require(:festival).permit(:festival_name, :festival_date, :season)
      end

      def filtered_festivals
        festivals = Festival.upcoming

        if params[:search].present?
          query = ActiveRecord::Base.sanitize_sql_like(params[:search].to_s.strip)
          festivals = festivals.where("festival_name ILIKE ?", "%#{query}%")
        end

        festivals = festivals.where("festival_date >= ?", params[:start_date]) if params[:start_date].present?
        festivals = festivals.where("festival_date <= ?", params[:end_date]) if params[:end_date].present?
        festivals
      end

      def pagination_params
        page = params[:page].to_i
        per_page = params[:per_page].to_i

        [page.positive? ? page : 1, per_page.between?(1, 100) ? per_page : 20]
      end

      def serialize_festival(festival)
        FestivalSerializer.new(festival).as_json
      end
    end
  end
end

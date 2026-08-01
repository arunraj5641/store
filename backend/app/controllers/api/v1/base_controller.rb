module Api
  module V1
    class BaseController < ApplicationController
      include ApiResponse
      include Authenticatable

      rescue_from StandardError, with: :handle_internal_server_error
      rescue_from ActiveRecord::RecordNotFound, with: :handle_record_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid
      rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
      rescue_from ActionController::BadRequest, with: :handle_bad_request
      rescue_from ActiveRecord::RecordNotUnique, with: :handle_record_not_unique

      private

      def handle_record_not_found(exception)
        render_not_found(message: exception.message.presence || "Resource not found.")
      end

      def handle_record_invalid(exception)
        render_validation_error(errors: exception.record)
      end

      def handle_parameter_missing(exception)
        render_error(
          message: "Required parameter missing: #{exception.param}.",
          status: :bad_request
        )
      end

      def handle_bad_request(exception)
        render_error(message: exception.message.presence || "Bad request.", status: :bad_request)
      end

      def handle_record_not_unique(_exception)
        render_error(message: "Record already exists.", status: :conflict)
      end

      def handle_internal_server_error(exception)
        log_exception(exception)
        render_error(message: "Internal server error.", status: :internal_server_error)
      end

      def pagination_meta(page:, per_page:, total:)
        page = page.to_i
        per_page = per_page.to_i
        total = total.to_i

        {
          page: page,
          per_page: per_page,
          total: total,
          total_pages: per_page.positive? ? (total.to_f / per_page).ceil : 0
        }
      end

      def log_exception(exception)
        Rails.logger.error("[#{exception.class}] #{exception.message}")
        Rails.logger.error(exception.backtrace.join("\n")) if exception.backtrace.present?
      end
    end
  end
end

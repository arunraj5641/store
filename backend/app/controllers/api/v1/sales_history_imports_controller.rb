module Api
  module V1
    class SalesHistoryImportsController < BaseController
      before_action :authenticate_user!

      def create
        return render_error(message: "CSV file is required.", status: :bad_request) if params[:file].blank?

        result = SalesHistoryCsvImporter.new(user: current_user, file: params[:file]).call
        return render_error(message: "Invalid CSV file.", status: :bad_request, errors: result.errors) if result.parse_error?

        render_api_response(
          success: true,
          message: "CSV imported successfully.",
          data: result.summary,
          errors: result.errors,
          meta: nil,
          status: :ok
        )
      end
    end
  end
end

module Api
  module V1
    class SalesHistoriesController < BaseController
      before_action :authenticate_user!
      before_action :set_sales_history, only: %i[show update destroy]

      def index
        page, per_page = pagination_params
        sales_histories = filtered_sales_histories
        total = sales_histories.count
        sales_histories = sales_histories.recent.offset((page - 1) * per_page).limit(per_page)

        render_success(
          message: "Sales histories fetched successfully.",
          data: { sales_histories: sales_histories.map { |sales_history| serialize_sales_history(sales_history) } },
          meta: pagination_meta(page: page, per_page: per_page, total: total)
        )
      end

      def show
        render_success(
          message: "Sales history fetched successfully.",
          data: { sales_history: serialize_sales_history(@sales_history) }
        )
      end

      def create
        product = current_user.products.find(create_sales_history_params[:product_id])
        sales_history = product.sales_histories.build(create_sales_history_params.except(:product_id))

        return render_validation_error(errors: sales_history) unless sales_history.save

        render_created(
          message: "Sales history created successfully.",
          data: { sales_history: serialize_sales_history(sales_history) }
        )
      end

      def update
        return render_validation_error(errors: @sales_history) unless @sales_history.update(update_sales_history_params)

        render_success(
          message: "Sales history updated successfully.",
          data: { sales_history: serialize_sales_history(@sales_history) }
        )
      end

      def destroy
        @sales_history.destroy!

        render_success(message: "Sales history deleted successfully.", data: {})
      end

      private

      def set_sales_history
        @sales_history = SalesHistory.where(product_id: current_user.products.select(:product_id)).find(params[:id])
      end

      def create_sales_history_params
        params.require(:sales_history).permit(:product_id, :sale_date, :quantity_sold)
      end

      def update_sales_history_params
        params.require(:sales_history).permit(:sale_date, :quantity_sold)
      end

      def filtered_sales_histories
        sales_histories = SalesHistory.where(product_id: current_user.products.select(:product_id))
        sales_histories = sales_histories.where(product_id: params[:product_id]) if params[:product_id].present?
        sales_histories = sales_histories.where("sale_date >= ?", params[:start_date]) if params[:start_date].present?
        sales_histories = sales_histories.where("sale_date <= ?", params[:end_date]) if params[:end_date].present?
        sales_histories
      end

      def pagination_params
        page = params[:page].to_i
        per_page = params[:per_page].to_i

        [page.positive? ? page : 1, per_page.between?(1, 100) ? per_page : 20]
      end

      def serialize_sales_history(sales_history)
        SalesHistorySerializer.new(sales_history).as_json
      end
    end
  end
end

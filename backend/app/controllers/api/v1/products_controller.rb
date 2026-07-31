module Api
  module V1
    class ProductsController < BaseController
      before_action :authenticate_user!
      before_action :set_product, only: %i[show update destroy]

      def index
        page, per_page = pagination_params
        products = filtered_products
        total = products.count
        products = products.order(product_id: :asc).offset((page - 1) * per_page).limit(per_page)

        render_success(
          message: "Products fetched successfully.",
          data: { products: products.map { |product| serialize_product(product) } },
          meta: pagination_meta(page: page, per_page: per_page, total: total)
        )
      end

      def show
        render_success(
          message: "Product fetched successfully.",
          data: { product: serialize_product(@product) }
        )
      end

      def create
        product = current_user.products.build(product_params)

        return render_validation_error(errors: product) unless product.save

        render_created(
          message: "Product created successfully.",
          data: { product: serialize_product(product) }
        )
      end

      def update
        return render_validation_error(errors: @product) unless @product.update(product_params)

        render_success(
          message: "Product updated successfully.",
          data: { product: serialize_product(@product) }
        )
      end

      def destroy
        @product.destroy!

        render_success(message: "Product deleted successfully.", data: {})
      end

      private

      def set_product
        @product = current_user.products.find(params[:id])
      end

      def product_params
        params.require(:product).permit(:product_name, :category, :current_stock, :reorder_threshold)
      end

      def filtered_products
        products = current_user.products

        if params[:search].present?
          query = ActiveRecord::Base.sanitize_sql_like(params[:search].to_s.strip)
          products = products.where("products.product_name ILIKE ?", "%#{query}%")
        end

        products = products.where(category: params[:category].to_s.strip) if params[:category].present?
        products = products.low_stock if params[:low_stock].to_s.casecmp("true").zero?
        products
      end

      def pagination_params
        page = params[:page].to_i
        per_page = params[:per_page].to_i

        [page.positive? ? page : 1, per_page.between?(1, 100) ? per_page : 20]
      end

      def serialize_product(product)
        ProductSerializer.new(product).as_json
      end
    end
  end
end

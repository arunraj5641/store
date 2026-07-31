module Api
  module V1
    class NotificationsController < BaseController
      before_action :authenticate_user!
      before_action :set_notification, only: %i[show update destroy]

      def index
        page, per_page = pagination_params
        notifications = filtered_notifications
        total = notifications.count
        notifications = notifications
                        .order(created_at: :desc, notification_id: :desc)
                        .offset((page - 1) * per_page)
                        .limit(per_page)

        render_success(
          message: "Notifications fetched successfully.",
          data: { notifications: notifications.map { |notification| serialize_notification(notification) } },
          meta: pagination_meta(page: page, per_page: per_page, total: total)
        )
      end

      def show
        render_success(
          message: "Notification fetched successfully.",
          data: { notification: serialize_notification(@notification) }
        )
      end

      def create
        attributes, recommendation_id = notification_attributes
        notification = current_user.notifications.build(attributes)
        assign_recommendation(notification, recommendation_id) if recommendation_id_supplied?

        return render_validation_error(errors: notification) unless notification.save

        render_created(
          message: "Notification created successfully.",
          data: { notification: serialize_notification(notification) }
        )
      end

      def update
        attributes, recommendation_id = notification_attributes
        assign_recommendation(@notification, recommendation_id) if recommendation_id_supplied?

        return render_validation_error(errors: @notification) unless @notification.update(attributes)

        render_success(
          message: "Notification updated successfully.",
          data: { notification: serialize_notification(@notification) }
        )
      end

      def destroy
        @notification.destroy!

        render_success(message: "Notification deleted successfully.", data: {})
      end

      private

      def set_notification
        @notification = current_user.notifications.find(params[:id])
      end

      def filtered_notifications
        notifications = current_user.notifications
        notifications = notifications.where(is_read: boolean_param(params[:is_read])) if params.key?(:is_read)
        notifications = notifications.where(recommendation_id: params[:recommendation_id]) if params[:recommendation_id].present?
        notifications
      end

      def notification_attributes
        attributes = notification_params
        recommendation_id = attributes.delete(:recommendation_id)

        [attributes, recommendation_id]
      end

      def notification_params
        params.require(:notification).permit(:recommendation_id, :message, :is_read)
      end

      def recommendation_id_supplied?
        params.require(:notification).key?(:recommendation_id)
      end

      def assign_recommendation(notification, recommendation_id)
        notification.recommendation = recommendation_id.present? ? owned_recommendations.find(recommendation_id) : nil
      end

      def owned_recommendations
        Recommendation.joins(:forecast).where(forecasts: { product_id: current_user.products.select(:product_id) })
      end

      def boolean_param(value)
        ActiveModel::Type::Boolean.new.cast(value)
      end

      def pagination_params
        page = params[:page].to_i
        per_page = params[:per_page].to_i

        [page.positive? ? page : 1, per_page.between?(1, 100) ? per_page : 20]
      end

      def serialize_notification(notification)
        NotificationSerializer.new(notification).as_json
      end
    end
  end
end

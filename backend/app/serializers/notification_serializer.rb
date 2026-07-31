class NotificationSerializer < ApplicationSerializer
  private

  def attributes
    {
      notification_id: record.notification_id,
      user_id: record.user_id,
      recommendation_id: record.recommendation_id,
      message: record.message,
      is_read: record.is_read,
      created_at: record.created_at,
      updated_at: record.updated_at
    }
  end
end

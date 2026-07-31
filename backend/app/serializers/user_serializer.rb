class UserSerializer < ApplicationSerializer
  private

  def attributes
    {
      user_id: record.user_id,
      name: record.name,
      email: record.email,
      shop_name: record.shop_name,
      created_at: record.created_at,
      updated_at: record.updated_at
    }
  end
end

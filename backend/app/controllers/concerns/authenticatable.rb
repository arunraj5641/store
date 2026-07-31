module Authenticatable
  extend ActiveSupport::Concern

  private

  def authenticate_user!
    token = bearer_token
    return render_unauthorized(message: "Missing token.") if token.blank?

    @current_user = find_authenticated_user(token)
    render_unauthorized(message: "Invalid token.") if @current_user.blank?
  rescue JwtService::ExpiredToken
    render_unauthorized(message: "Token has expired.")
  rescue JwtService::InvalidToken
    render_unauthorized(message: "Invalid token.")
  end

  def current_user
    @current_user
  end

  def find_authenticated_user(token)
    payload = JwtService.decode(token)

    User.find_by(user_id: payload[:user_id])
  end

  def bearer_token
    authorization_header = request.headers["Authorization"].to_s
    return if authorization_header.blank?

    scheme, token = authorization_header.split(" ", 2)
    raise JwtService::InvalidToken unless scheme&.casecmp("Bearer")&.zero? && token.present?

    token
  end
end

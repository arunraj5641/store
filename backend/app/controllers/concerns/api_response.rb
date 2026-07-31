module ApiResponse
  extend ActiveSupport::Concern

  private

  def render_success(message:, data: {}, meta: nil, status: :ok)
    render_api_response(
      success: true,
      message: message,
      data: data,
      errors: nil,
      meta: meta,
      status: status
    )
  end

  def render_created(message:, data: {}, meta: nil)
    render_success(message: message, data: data, meta: meta, status: :created)
  end

  def render_error(message:, status: :internal_server_error, errors: nil, meta: nil)
    render_api_response(
      success: false,
      message: message,
      data: nil,
      errors: errors,
      meta: meta,
      status: status
    )
  end

  def render_validation_error(errors:, message: "Validation failed.")
    render_error(
      message: message,
      errors: normalize_errors(errors),
      status: :unprocessable_entity
    )
  end

  def render_not_found(message: "Resource not found.")
    render_error(message: message, status: :not_found)
  end

  def render_unauthorized(message: "Unauthorized.")
    render_error(message: message, status: :unauthorized)
  end

  def render_forbidden(message: "Forbidden.")
    render_error(message: message, status: :forbidden)
  end

  def render_no_content
    head :no_content
  end

  def render_api_response(success:, message:, data:, errors:, meta:, status:)
    render json: {
      success: success,
      message: message,
      data: data,
      errors: errors,
      meta: meta
    }, status: status
  end

  def normalize_errors(errors)
    return nil if errors.blank?

    if errors.is_a?(ActiveModel::Errors)
      errors.to_hash(true)
    elsif errors.respond_to?(:errors)
      normalize_errors(errors.errors)
    elsif errors.respond_to?(:to_hash)
      errors.to_hash
    else
      errors
    end
  end
end

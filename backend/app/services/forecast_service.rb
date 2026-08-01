require "json"
require "net/http"
require "uri"

class ForecastService
  DEFAULT_BASE_URL = "http://ai-service:8000"
  OPEN_TIMEOUT_SECONDS = 5
  READ_TIMEOUT_SECONDS = 35

  class Error < StandardError
    attr_reader :status, :details

    def initialize(message, status:, details: nil)
      @status = status
      @details = details
      super(message)
    end
  end

  class TimeoutError < Error
    def initialize
      super("AI forecasting request timed out.", status: :gateway_timeout)
    end
  end

  class UnavailableError < Error
    def initialize
      super("AI forecasting service is unavailable.", status: :service_unavailable)
    end
  end

  class InvalidResponseError < Error
    def initialize
      super("AI forecasting service returned an invalid response.", status: :bad_gateway)
    end
  end

  def initialize(base_url: ENV.fetch("AI_SERVICE_URL", DEFAULT_BASE_URL))
    @base_url = base_url
  end

  def forecast(product_id:, authorization: nil)
    response = post(forecast_uri(product_id), authorization)
    validate_forecast_response!(successful_response(response))
  rescue URI::InvalidURIError
    raise InvalidResponseError
  end

  def reorder(product_id:, authorization: nil)
    response = post(reorder_uri(product_id), authorization)
    validate_reorder_response!(successful_response(response))
  rescue URI::InvalidURIError
    raise InvalidResponseError
  end

  private

  def forecast_uri(product_id)
    endpoint_uri("forecast/product/#{product_id}")
  end

  def reorder_uri(product_id)
    endpoint_uri("forecast/reorder/#{product_id}")
  end

  def endpoint_uri(path)
    base_url = @base_url.end_with?("/") ? @base_url : "#{@base_url}/"
    URI.join(base_url, path)
  end

  def post(uri, authorization)
    request = Net::HTTP::Post.new(uri)
    request["Accept"] = "application/json"
    request["Authorization"] = authorization if authorization.present?

    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.open_timeout = OPEN_TIMEOUT_SECONDS
    http.read_timeout = READ_TIMEOUT_SECONDS
    http.request(request)
  rescue JSON::ParserError, URI::InvalidURIError
    raise InvalidResponseError
  rescue Net::OpenTimeout, Net::ReadTimeout, Timeout::Error
    raise TimeoutError
  rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH, SocketError
    raise UnavailableError
  end

  def successful_response(response)
    parsed_response = parse_json(response.body)
    return parsed_response if response.is_a?(Net::HTTPSuccess)

    raise Error.new(
      extract_error_message(parsed_response),
      status: rails_status_for(response.code.to_i),
      details: parsed_response
    )
  rescue JSON::ParserError
    raise InvalidResponseError
  end

  def parse_json(body)
    parsed_body = JSON.parse(body.presence || "{}")
    raise InvalidResponseError unless parsed_body.is_a?(Hash)

    parsed_body
  end

  def validate_forecast_response!(response)
    predictions = response["predictions"]
    valid_predictions = predictions.is_a?(Array) && predictions.all? do |prediction|
      prediction.is_a?(Hash) && prediction["date"].is_a?(String) &&
        prediction["predicted_sales"].is_a?(Numeric)
    end

    required_numbers = %w[product_id average_daily_sales total_predicted_sales]
    valid_numbers = required_numbers.all? { |key| response[key].is_a?(Numeric) }
    raise InvalidResponseError unless valid_predictions && valid_numbers

    response.deep_symbolize_keys
  end

  def validate_reorder_response!(response)
    required_numbers = %w[
      product_id current_stock dynamic_reorder_level recommended_order_quantity
    ]
    valid_numbers = required_numbers.all? { |key| response[key].is_a?(Numeric) }
    valid_text = response["inventory_risk"].is_a?(String) && response["reason"].is_a?(String)
    raise InvalidResponseError unless valid_numbers && valid_text

    response.deep_symbolize_keys
  end

  def extract_error_message(parsed_response)
    detail = parsed_response["detail"]
    return detail if detail.is_a?(String)
    return detail["message"] if detail.is_a?(Hash) && detail["message"].present?

    "AI forecasting request failed."
  end

  def rails_status_for(status_code)
    case status_code
    when 401 then :unauthorized
    when 403 then :forbidden
    when 404 then :not_found
    when 422 then :unprocessable_entity
    when 424, 502 then :bad_gateway
    when 503 then :service_unavailable
    when 504 then :gateway_timeout
    else :bad_gateway
    end
  end
end

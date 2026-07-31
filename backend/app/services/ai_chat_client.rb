require "json"
require "net/http"
require "uri"

class AiChatClient
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
      super("AI chat request timed out.", status: :gateway_timeout)
    end
  end

  class UnavailableError < Error
    def initialize
      super("AI chat service is unavailable.", status: :service_unavailable)
    end
  end

  class InvalidResponseError < Error
    def initialize
      super("AI chat service returned an invalid response.", status: :bad_gateway)
    end
  end

  def initialize(base_url: ENV.fetch("AI_SERVICE_URL", DEFAULT_BASE_URL))
    @base_url = base_url
  end

  def chat(message:, store_data:)
    response = post_json(
      chat_uri,
      {
        message: message,
        store_data: store_data
      }
    )
    parsed_response = parse_json(response.body)

    unless response.is_a?(Net::HTTPSuccess)
      raise Error.new(
        extract_error_message(parsed_response),
        status: rails_status_for(response.code.to_i),
        details: parsed_response
      )
    end

    reply = parsed_response["response"]
    raise InvalidResponseError unless reply.is_a?(String)

    { reply: reply.strip }
  rescue JSON::ParserError
    raise InvalidResponseError
  rescue URI::InvalidURIError
    raise InvalidResponseError
  rescue Net::OpenTimeout, Net::ReadTimeout, Timeout::Error
    raise TimeoutError
  rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH, SocketError
    raise UnavailableError
  end

  private

  def chat_uri
    base_url = @base_url.end_with?("/") ? @base_url : "#{@base_url}/"
    URI.join(base_url, "chat")
  end

  def post_json(uri, payload)
    request = Net::HTTP::Post.new(uri)
    request["Accept"] = "application/json"
    request["Content-Type"] = "application/json"
    request.body = JSON.generate(payload)

    http = Net::HTTP.new(uri.hostname, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.open_timeout = OPEN_TIMEOUT_SECONDS
    http.read_timeout = READ_TIMEOUT_SECONDS
    http.request(request)
  end

  def parse_json(body)
    parsed_body = JSON.parse(body.presence || "{}")
    raise InvalidResponseError unless parsed_body.is_a?(Hash)

    parsed_body
  end

  def extract_error_message(parsed_response)
    detail = parsed_response["detail"]
    return detail if detail.is_a?(String)
    return detail["message"] if detail.is_a?(Hash) && detail["message"].present?

    "AI chat request failed."
  end

  def rails_status_for(status_code)
    case status_code
    when 422
      :unprocessable_entity
    when 424, 502
      :bad_gateway
    when 503
      :service_unavailable
    when 504
      :gateway_timeout
    else
      :bad_gateway
    end
  end
end

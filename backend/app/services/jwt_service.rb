class JwtService
  ALGORITHM = "HS256"
  DEFAULT_EXPIRATION_HOURS = 24

  class Error < StandardError; end
  class ExpiredToken < Error; end
  class InvalidToken < Error; end

  class << self
    def encode(user_id:, expires_at: default_expires_at)
      payload = {
        user_id: user_id,
        exp: expires_at.to_i
      }

      JWT.encode(payload, secret_key, ALGORITHM)
    end

    def decode(token)
      payload, = JWT.decode(token, secret_key, true, algorithm: ALGORITHM)

      payload.with_indifferent_access
    rescue JWT::ExpiredSignature
      raise ExpiredToken, "Token has expired."
    rescue JWT::DecodeError
      raise InvalidToken, "Invalid token."
    end

    private

    def default_expires_at
      expiration_hours.hours.from_now
    end

    def expiration_hours
      ENV.fetch("JWT_EXPIRATION_HOURS", DEFAULT_EXPIRATION_HOURS).to_i
    end

    def secret_key
      ENV["JWT_SECRET_KEY"].presence || Rails.application.secret_key_base
    end
  end
end

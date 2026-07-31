module Api
  module V1
    class AuthController < BaseController
      before_action :authenticate_user!, only: :me

      def signup
        user = User.new(signup_params)

        return render_validation_error(errors: user) unless user.save

        render_created(message: "Signup successful.", data: auth_payload(user))
      end

      def login
        credentials = login_params
        user = User.find_by(email: credentials[:email])

        return render_unauthorized(message: "Invalid email or password.") unless authenticated_user?(user, credentials[:password])

        render_success(message: "Login successful.", data: auth_payload(user))
      end

      def me
        render_success(
          message: "Current user fetched successfully.",
          data: { user: serialize_user(current_user) }
        )
      end

      private

      def signup_params
        params.require(:user).permit(:name, :email, :shop_name, :password, :password_confirmation)
      end

      def login_params
        params.require(:user).permit(:email, :password)
      end

      def authenticated_user?(user, password)
        user&.authenticate(password)
      end

      def auth_payload(user)
        {
          user: serialize_user(user),
          token: JwtService.encode(user_id: user.user_id)
        }
      end

      def serialize_user(user)
        UserSerializer.new(user).as_json
      end
    end
  end
end

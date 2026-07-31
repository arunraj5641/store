Rails.application.routes.draw do
  get "health", to: "health#show"

  get "up" => "rails/health#show", as: :rails_health_check
end

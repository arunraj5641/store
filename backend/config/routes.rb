Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "signup", to: "auth#signup"
      post "login", to: "auth#login"
      get "me", to: "auth#me"

      get "products", to: "products#index"
      post "products", to: "products#create"
      get "products/:id", to: "products#show"
      put "products/:id", to: "products#update"
      delete "products/:id", to: "products#destroy"

      get "sales_histories", to: "sales_histories#index"
      post "sales_histories", to: "sales_histories#create"
      post "sales_histories/import", to: "sales_history_imports#create"
      get "sales_histories/:id", to: "sales_histories#show"
      put "sales_histories/:id", to: "sales_histories#update"
      delete "sales_histories/:id", to: "sales_histories#destroy"

      get "festivals", to: "festivals#index"
      post "festivals", to: "festivals#create"
      get "festivals/:id", to: "festivals#show"
      put "festivals/:id", to: "festivals#update"
      delete "festivals/:id", to: "festivals#destroy"

      get "forecasts", to: "forecasts#index"
      post "forecasts", to: "forecasts#create"
      get "forecasts/:id", to: "forecasts#show"
      put "forecasts/:id", to: "forecasts#update"
      delete "forecasts/:id", to: "forecasts#destroy"

      get "recommendations", to: "recommendations#index"
      post "recommendations", to: "recommendations#create"
      get "recommendations/:id", to: "recommendations#show"
      put "recommendations/:id", to: "recommendations#update"
      delete "recommendations/:id", to: "recommendations#destroy"

      get "notifications", to: "notifications#index"
      post "notifications", to: "notifications#create"
      get "notifications/:id", to: "notifications#show"
      put "notifications/:id", to: "notifications#update"
      delete "notifications/:id", to: "notifications#destroy"
    end
  end

  get "health", to: "health#show"

  get "up" => "rails/health#show", as: :rails_health_check
end

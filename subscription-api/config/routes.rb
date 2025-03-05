Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  # API routes
  namespace :api do
    # Health check endpoint
    get 'health', to: 'health#index'
    
    # Subscription endpoints
    post 'company_subscription', to: 'company_subscriptions#create'
    
    # Payment endpoints
    get 'payments', to: 'payments#index'
    
    # Receipt endpoints
    get 'receipts/:id', to: 'receipts#show'

    resources :receipts, only: [:show] do
      get :download, on: :member
    end
  end
end

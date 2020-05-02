Rails.application.routes.draw do

  root 'users#index'

  resources :users, only: :index do
    collection do
      get :list
      get :list_json
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

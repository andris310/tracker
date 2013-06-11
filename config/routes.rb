Tracker::Application.routes.draw do
  resources :tracking

  devise_for :users


  root :to => 'pages#home'
  get '/track', to: 'tracking#track'
  get '/map', to: 'tracking#map'
  post '/create', to: 'tracking#create_item'


end

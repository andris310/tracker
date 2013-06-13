Tracker::Application.routes.draw do
  resources :tracking

  devise_for :users


  root :to => 'tracking#home'
  get '/track', to: 'tracking#track'
  get '/map', to: 'tracking#map'
  post '/create', to: 'tracking#create_item'
  get '/delivered', to: 'tracking#list_delivered'


end

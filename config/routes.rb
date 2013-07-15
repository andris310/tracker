Tracker::Application.routes.draw do
  resources :tracking

  devise_for :users


  root :to => 'tracking#map'
  get '/track', to: 'tracking#track'
  get '/map', to: 'tracking#map'
  post '/create', to: 'tracking#create_item'
  get '/delivered', to: 'tracking#list_delivered'
  get '/in-transit', to: 'tracking#list_in_transit'
  get '/all', to: 'tracking#list_all'
  get '/details', to: 'tracking#item_details'
  get '/showinfo', to: 'tracking#show'
  get '/more-info', to: 'tracking#more_info'
  delete '/delete', to: 'tracking#destroy'


end

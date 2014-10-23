Site::Application.routes.draw do
  patch "get_entry", to:"data#get_next_results"
  get "faq", to: "faq"
  get "about", to: "about"
  get "data", to: "data"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'
end

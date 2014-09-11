Site::Application.routes.draw do
  get "faq/faq"
  get "about/about"
  get "data/data"
  get "static_pages/destroy"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'
end

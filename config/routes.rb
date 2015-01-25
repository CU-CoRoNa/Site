Site::Application.routes.draw do
  get "get_entry", to:"data#get_entry_template"
  patch "do_browse", to:"data#do_browse"
  patch "do_search", to:"data#do_search"
  get "faq", to: "faq"
  get "about", to: "about"
  get "data", to: "data"
  get 'templateWelcome', to:'welcome#templateIndex'
  get 'templateData', to:'data#templateIndex'
  get 'templateAbout', to:'about#templateIndex'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'welcome#index'
end

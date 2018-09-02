Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/career_levels', to: 'applicants#career_levels'
  post '/applicant', to: 'applicants#create'
  get '/skills', to: 'skills#index'
  post '/upload_image', to: 'uploads#create'
  root to: redirect('applicant/index.html')
end

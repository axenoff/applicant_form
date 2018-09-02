class ApplicantsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
  end

  def create
    Applicant.create(params)

    render json: {created: true}  
  end

  def career_levels
    career_levels = Applicant.career_levels.keys
    render json: {career_levels: career_levels}
  end
end

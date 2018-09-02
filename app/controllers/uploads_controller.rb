class UploadsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    newImage = Upload.new
    newImage.file = params["uploaded_image"]
    if newImage.save
      render json: Upload.last
    else
      render json: {error: true}
    end
  end
end

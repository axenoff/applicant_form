class Upload < ApplicationRecord
  validates :file, presence: true

  belongs_to :applicant, optional: true

  mount_uploader :file, FileUploader
end

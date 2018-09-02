class ApplicantSkill < ApplicationRecord
  belongs_to :applicant, foreign_key: :applicant_id
  belongs_to :skill, foreign_key: :skill_id
end

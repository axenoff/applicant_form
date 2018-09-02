class Skill < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  has_many :applicant_skills, foreign_key: :skill_id, class_name: 'ApplicantSkill'
  has_many :applicants, through: :applicant_skills
end

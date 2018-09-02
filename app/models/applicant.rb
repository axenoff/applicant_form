class Applicant < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, format: {with: /\A^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$\z/}
  validates_length_of :cover_note, :maximum => 200

  enum career_level: {
    student: 'student',
    graduate: 'graduate',
    entry_level: 'entry_level',
    experienced: 'experienced',
    executive: 'executive',
    senior_executive: 'senior_executive'
  }

  has_many :applicant_skills, foreign_key: :applicant_id, class_name: 'ApplicantSkill'
  has_many :skills, through: :applicant_skills
  has_one :upload

  def self.create(params)
    applicant = Applicant.new(
      name: params[:name],
      email: params[:email],
      phone: params[:phone],
      career_level: params[:career_level],
      experience: params[:experience].to_i,
      cover_note: params[:cover_note]
    )
    applicant.save

    skills = params[:skills].to_a
    skills.map do |skill|
      if skill[:id]
        ApplicantSkill.create(skill_id: skill[:id].to_i, applicant_id: applicant.id.to_i)
      else
        new_skill = Skill.create(name: skill[:name])
        ApplicantSkill.create(skill_id: new_skill.id, applicant_id: applicant.id)
      end
    end

    if params[:image]
      image = Upload.find(params[:image])
      image.applicant_id = applicant.id
      image.save
    end
  end
end

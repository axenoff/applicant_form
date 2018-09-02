class SkillsController < ApplicationController
  def index
    skills = Skill.distinct.pluck(:name, :id)
    result = skills.inject({}) do |memo, element|
      result_item = {}
      result_item[element[0]] = element[1]
      memo[element[0]] = element[1]
      memo
    end
    render json: {skills: result}
  end
end

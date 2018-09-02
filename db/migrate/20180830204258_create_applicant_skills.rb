class CreateApplicantSkills < ActiveRecord::Migration[5.2]
  def change
    create_table :applicant_skills do |t|
      t.integer :applicant_id
      t.index :applicant_id
      t.integer :skill_id
      t.index :skill_id

      t.timestamps
    end
  end
end

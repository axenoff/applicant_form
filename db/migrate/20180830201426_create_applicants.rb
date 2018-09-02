class CreateApplicants < ActiveRecord::Migration[5.2]
  def change
    create_table :applicants do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.string :career_level
      t.integer :experience
      t.text :cover_note

      t.timestamps
    end
  end
end

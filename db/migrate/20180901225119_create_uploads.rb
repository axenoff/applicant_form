class CreateUploads < ActiveRecord::Migration[5.2]
  def change
    create_table :uploads do |t|
      t.string :applicant_id
      t.string :file

      t.timestamps
    end
  end
end

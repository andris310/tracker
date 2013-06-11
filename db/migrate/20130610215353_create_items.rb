class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :tracking_id
      t.string :tracking_summary
      t.integer :user_id

      t.timestamps
    end
  end
end

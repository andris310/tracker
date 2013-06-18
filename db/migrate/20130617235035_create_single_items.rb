class CreateSingleItems < ActiveRecord::Migration
  def change
    create_table :single_items do |t|
      t.string :tracking_id

      t.timestamps
    end
  end
end

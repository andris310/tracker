class CreateDetails < ActiveRecord::Migration
  def change
    create_table :details do |t|
      t.string :tracking_detail
      t.integer :item_id

      t.timestamps
    end
  end
end

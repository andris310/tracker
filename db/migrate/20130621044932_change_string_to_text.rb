class ChangeStringToText < ActiveRecord::Migration
  def up
    change_column :items, :tracking_summary, :text
    change_column :details, :tracking_detail, :text
  end

  def down
    change_column :items, :tracking_summary, :string
    change_column :details, :tracking_detail, :string
  end
end

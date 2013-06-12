class AddDeliveredToItem < ActiveRecord::Migration
  def change
    add_column :items, :delivered, :boolean
  end
end

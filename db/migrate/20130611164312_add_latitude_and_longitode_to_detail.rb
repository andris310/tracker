class AddLatitudeAndLongitodeToDetail < ActiveRecord::Migration
  def change
    add_column :details, :latitude, :float
    add_column :details, :longitude, :float
  end
end

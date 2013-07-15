class Detail < ActiveRecord::Base
  attr_accessible :item_id, :tracking_detail, :address
  belongs_to :item
  belongs_to :user
end

class Detail < ActiveRecord::Base
  attr_accessible :item_id, :tracking_detail
  belongs_to :item
end

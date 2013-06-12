require 'nokogiri'
require 'open-uri'
require 'pry'

class TrackingController < ApplicationController

  # before_filter :auth_user


  def track
  end

  def map
    @items = current_user.items
    @items.map do |item|

      item.create_detail
    end
    # item = Item.last
    # details = Detail.find_all_by_item_id(item.id)
    # render :json => item
  end

  def create_item
    @item = Item.find_by_tracking_id(params[:q])
    if @item.nil?
      @item = Item.new
      @item.tracking_id = params[:q]
      @item.user_id = current_user.id
    end

    @item.update_summary
    @item.save
    @item.create_detail
  end
end
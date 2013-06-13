require 'nokogiri'
require 'open-uri'
require 'pry'

class TrackingController < ApplicationController

  # before_filter :auth_user


  def track
  end

  def list_delivered
    @items = Item.where(:user_id => current_user, :delivered => true)
    @items.map do |item|
      if !(item.delivered)
        item.update_summary
        item.create_detail
      end
    end
  end

  def map
    # @items = current_user.items
    @items = Item.where(:user_id => current_user, :delivered => true)
    @items.map do |item|
      if !(item.delivered)
        item.update_summary
        item.create_detail
      end
    end
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

    render :json => @item.to_json
  end
end
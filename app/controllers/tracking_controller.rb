require 'nokogiri'
require 'open-uri'
require 'pry'

class TrackingController < ApplicationController
  # before_filter :auth_user

  def track
  end

  def list_in_transit
    @items = Item.where(:user_id => current_user, :status => "In Transit")
    run_update(@items)
    render :json => @items.to_json
  end

  def list_delivered
    @items = Item.where(:user_id => current_user, :delivered => true)
    run_update(@items)
    render :json => @items.to_json
  end

  def list_all
    @items = Item.where(:user_id => current_user)
    run_update(@items)
    render :json => @items.to_json
  end

  def item_details
    hidden_details = (Detail.where('item_id' => i.id)).reverse
    # render :json =>
  end

  def map
    # @items = current_user.items
    @items = Item.where(:user_id => current_user, :delivered => true)
    run_update(@items)
    # render :json => @items.to_json
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

  private
    def run_update items_to_update
    items_to_update.map do |item|
      if !(item.delivered)
        item.update_summary
        item.create_detail
      end
    end
  end
end
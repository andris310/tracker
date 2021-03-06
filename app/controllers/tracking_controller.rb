require 'nokogiri'
require 'open-uri'
require 'pry'

class TrackingController < ApplicationController
  # before_filter :auth_user

  def show
    item = SingleItem.new(params[:q])
    render :json => item.to_json
  end

  def more_info
    @info = Detail.where(:item_id => params[:q]).order('created_at DESC')
    render :json => @info.to_json
  end

  def list_in_transit
    @items = Item.where(:user_id => current_user, :status => 'In Transit').order('created_at DESC')
    run_update(@items)
    render :json => @items.to_json
  end

  def list_delivered
    @items = Item.where(:user_id => current_user, :delivered => true).order("created_at DESC")
    run_update(@items)
    render :json => @items.to_json
  end

  def list_all
    @items = Item.where(:user_id => current_user).order("created_at DESC")
    run_update(@items)
    render :json => @items.to_json
  end

  def item_details
    id = params[:q]
    hidden_details = (Detail.where('item_id' => id)).reverse
    render :json => hidden_details.to_json
  end

  def map
    # @items = current_user.items
    @items = Item.where(:user_id => current_user, :delivered => true).order("created_at DESC")
    run_update(@items)
    @count_all = Item.where(:user_id => current_user).count
    @count_delivered = @items.count
    @count_intransit = Item.where(:user_id => current_user, :status => "In Transit").count
    # render :json => @items.to_json
  end

  def item_count
    count_all = Item.where(:user_id => current_user).count
    count_delivered = Item.where(:user_id => current_user, :delivered => true).count
    count_intransit = Item.where(:user_id => current_user, :status => "In Transit").count
    render :json => {'allitems' => count_all, 'delivered' => count_delivered, 'intransit' => count_intransit}
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

  def destroy
    @item = Item.find(params[:q])
    @item.destroy
  end

  private
    def run_update packages
    packages.map do |item|
      if !(item.delivered)
        item.update_summary
        item.create_detail
      end
    end
  end
end
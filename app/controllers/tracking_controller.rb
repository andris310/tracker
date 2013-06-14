require 'nokogiri'
require 'open-uri'
require 'pry'

class TrackingController < ApplicationController
  # before_filter :auth_user

  def show
    tracking_id = '9405510200883811412066'
    url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3CTrackRequest%20USERID=%22#{URI.escape(ENV['USPS_ID'])}%22%3E%3CTrackID%20ID=%22#{URI.escape(tracking_id)}%22%3E%3C/TrackID%3E%3C/TrackRequest%3E"
      doc = Nokogiri::XML(open(url))
      doc.xpath('//TrackDetail').each do |x|
        # detail = Detail.new
        # detail.item_id = id
        #   detail.tracking_detail = x.text
        #   detail.address = detail.tracking_detail.split(',')[-2..-1].join()
        #   geodata = Geocoder.search(detail.address)
        #   detail.latitude = geodata[0].latitude
        #   detail.longitude = geodata[0].longitude
      end
      render :json => @items.to_json
  end

  def list_in_transit
    @items = Item.where(:user_id => current_user, :status => "In Transit").order("created_at DESC")
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
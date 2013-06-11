require 'nokogiri'
require 'open-uri'
require 'pry'

class TrackingController < ApplicationController

  # before_filter :auth_user

  def track

  end

  def create_item
    @item = Item.find_by_tracking_id(params[:q])
    if @item.nil?
      @item = Item.new
      @item.tracking_id = params[:q]
      @item.user_id = current_user.id
    end

    if @item.tracking_summary.nil?
      url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3CTrackRequest%20USERID=%22#{URI.escape(ENV['USPS_ID'])}%22%3E%3CTrackID%20ID=%#{URI.escape(@item.tracking_id)}%22%3E%3C/TrackID%3E%3C/TrackRequest%3E"
      doc = Nokogiri::XML(open(url))
      doc.xpath('//TrackInfo').each do |x|
        @item.tracking_summary = x.xpath("//TrackSummary").text
      end
    end
    @item.save
    @item.create_detail
  end

end
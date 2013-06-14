require 'pry'

class Item < ActiveRecord::Base
  attr_accessible :tracking_id, :tracking_summary, :user_id, :delivered, :status
  belongs_to :user
  has_many :details

    def initialize(attributes = {})
      super
      self.delivered = false
      self.status = 'In Transit'
    end

    def update_summary
      url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3CTrackRequest%20USERID=%22#{URI.escape(ENV['USPS_ID'])}%22%3E%3CTrackID%20ID=%22#{URI.escape(self.tracking_id)}%22%3E%3C/TrackID%3E%3C/TrackRequest%3E"
      doc = Nokogiri::XML(open(url))

      doc.xpath('//TrackInfo').each do |x|
        self.tracking_summary = x.xpath("//TrackSummary").text
        if self.tracking_summary.include?('delivered')
          self.status = 'Delivered'
          self.delivered = true
        end
      end
    end

    def create_detail
      url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3CTrackRequest%20USERID=%22#{URI.escape(ENV['USPS_ID'])}%22%3E%3CTrackID%20ID=%22#{URI.escape(tracking_id)}%22%3E%3C/TrackID%3E%3C/TrackRequest%3E"
      doc = Nokogiri::XML(open(url))
      doc.xpath('//TrackDetail').each do |x|
        if (Detail.find_by_tracking_detail(x.text)).nil?
          detail = Detail.new
          detail.item_id = id
          detail.tracking_detail = x.text
          detail.address = detail.tracking_detail.split(',')[-2..-1].join()
          geodata = Geocoder.search(detail.address)
          detail.latitude = geodata[0].latitude
          detail.longitude = geodata[0].longitude

          if !(detail.tracking_detail.include?('Electronic Shipping Info Received'))
            detail.save
          end

        end
      end
    end
end

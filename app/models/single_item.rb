require 'pry'
class SingleItem
  attr_accessor :tracking_id

  def initialize tracking_id
    @tracking_id = tracking_id
    url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3CTrackRequest%20USERID=%22#{URI.escape(ENV['USPS_ID'])}%22%3E%3CTrackID%20ID=%22#{URI.escape(tracking_id)}%22%3E%3C/TrackID%3E%3C/TrackRequest%3E"
    doc = Nokogiri::XML(open(url))

    @summary = doc.xpath('//TrackSummary').text

    @details = []
    @locations = []
    doc.xpath('//TrackDetail').each do |item|
      if !(item.text.include?('Electronic Shipping Info Received'))
        @details << item.text
        address = item.text.split(',')[-2..-1].join()
        geodata = Geocoder.search(address)
        latitude = geodata[0].latitude
        longitude = geodata[0].longitude
        @locations << [latitude, longitude, address]
      end
    end
    @locations.reverse!
  end

end

require 'nokogiri'

require 'open-uri'

url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3CTrackRequest%20USERID=%22848NA0000595%22%3E%3CTrackID%20ID=%229400110200793702141357%22%3E%3C/TrackID%3E%3C/TrackRequest%3E"

d = Nokogiri::XML(open(url))

# d.xpath('//TrackInfo').each do |x|
  d.xpath("//TrackDetail").each do |t|
    puts t.text
  end
#   puts "--"
# end

require 'nokogiri'

require 'open-uri'

url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=%3CTrackRequest%20USERID=%22848NA0000595%22%3E%3CTrackID%20ID=%229400110200793702141357%22%3E%3C/TrackID%3E%3C/TrackRequest%3E"

d = Nokogiri::XML(open(url))

  puts d.xpath('//TrackSummary').text
  # d.xpath("//TrackDetail").each do |t|


#   puts "--"
# end

# <% @items.each do |i| %>
#         <div class='item'>
#           <% lu = Detail.find_by_item_id(i.id) %>
#           <% if !lu.nil? %>
#             <p data-lat=<%= lu.latitude %>
#                data-lng=<%= lu.longitude %>
#                data-address=<%= lu.tracking_detail.split(',')[-2..-1].join() %>
#                data-delivered=<%= i.status %>>
#           <% end %>
#               <%= i.tracking_id %>
#             </p>
#             <hr/>
#           <span> <%= i.tracking_summary %></span>

#           <div class='hidden-data'>
#             <% hidden_details = (Detail.where('item_id' => i.id)).reverse %>
#             <% hidden_details.each do |d| %>
#               <p data-lat="<%= d.latitude %>"
#                  data-lng="<%= d.longitude %>"
#                  data-address="<%= d.tracking_detail.split(',')[-2..-1].join() %>">
#               </p>
#             <% end %>
#           </div>
#         </div>
#       <% end %>
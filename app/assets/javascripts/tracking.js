
var map = L.map('map').setView([38.737, -93.923], 4);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add a marker in the given location, attach some popup content to it and open the popup

// var marker;
var markers = [];
var latlngs = [];
var polyline;
$('#item-list').on('click', 'p', function() {
  $(markers).each(function(index, marker){
    map.removeLayer(marker);
  });
  $(latlngs).each(function(index, latlng) {
    map.removeLayer(polyline);
  });


  markers = [];
  latlngs = [];
  $(this).next().next().children().each(function(index, point){
    var pt = $(point);
    var lat = pt.data('lat');
    var lng = pt.data('lng');
    var marker = L.marker([lat, lng]).addTo(map)
          .bindPopup(pt.data('address') + '\n' + pt.data('delivered'))
          .openPopup();
    latlngs.push([lat, lng]);
    markers.push(marker);
  });
  polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
    // map.fitBounds(polyline.getBounds());
});



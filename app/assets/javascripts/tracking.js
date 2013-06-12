
var map = L.map('map').setView([38.737, -93.923], 4);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add a marker in the given location, attach some popup content to it and open the popup

// var marker;
var markers = [];
var latlng = [];
$('p').on('click', function() {
  $(markers).each(function(index, marker){
    map.removeLayer(marker);
  });
  // $(latlng).each(function(index, latlng) {
  //   debugger;
  //   map.removeLayer(polyline);
  // });
  // if(typeof marker != 'undefined') {
  //   map.removeLayer(marker);
  // }
  // var element = $(this);
  // var lat = element.data('lat');
  // var lng = element.data('lng');

  // marker = L.marker([lat, lng]).addTo(map)
  //             .bindPopup(element.data('address') + '\n' + element.data('delivered'))
  //             .openPopup();
  // map.addLayer(marker);

  markers = [];
  latlng = [];
  $(this).next().next().children().each(function(index, point){
    var pt = $(point);
    var lat = pt.data('lat');
    var lng = pt.data('lng');
    var marker = L.marker([lat, lng]).addTo(map)
          .bindPopup(pt.data('address'))
          .openPopup();
    latlng.push([lat, lng]);
    markers.push(marker);
  });
  var polyline = L.polyline(latlng, {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());
});



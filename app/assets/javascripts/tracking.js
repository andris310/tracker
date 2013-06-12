var map = L.map('map').setView([38.737, -93.923], 4);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add a marker in the given location, attach some popup content to it and open the popup

var marker;
$('p').on('click', function(){
  if(typeof marker != 'undefined') {
    map.removeLayer(marker);
  }
  var element = $(this);
  var lat = element.data('lat');
  var lng = element.data('lng');

  marker = L.marker([lat, lng]).addTo(map)
                  .bindPopup(element.data('address') + '\n' + element.data('delivered'))
                  .openPopup();
  map.addLayer(marker);
});

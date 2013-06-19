var timer;
var markers = [];
var latlngs = [];
var polyline;

var map = L.map('map').setView([38.737, -93.923], 4);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);


function getDetails() {
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
          .bindPopup(pt.data('address') + '\n')
          .openPopup();
    latlngs.push([lat, lng]);
    markers.push(marker);
    map.panTo([lat, lng], 8);
  });
  polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
    // map.fitBounds(polyline.getBounds());
});
}



function getItems(link) {
  $.ajax({
    url: link,
    method: 'get',
    dataType: 'json',
    beforeSend: function () {
      timer = setTimeout(function () { $('.spinner').fadeIn(); }, 100);
    },
    complete: function () {
      clearTimeout(timer);
      $('.spinner').fadeOut();
    },
    success: function(results) {
      var list = $('#item-list');
      list.html('');
      $(results).each(function(index, result) {
        var num = result['tracking_id'];
        var summary = result['tracking_summary'];
        var delivered = result['status'];
        var item = $('<div class="item"></div>');
        list.append(item).fadeIn(1000);
        item.attr('id', result['id']);
        item.append($('<p>' + num + '</p>'));
        item.append($('<span>' + summary + '</spna>'));
      });
    }
  });
}

function validateUspsTracking (tracking_nr) {
  var nr = $('#q').val();
  var filter = /^\d{22}$/;
  if (filter.test(nr)) {
        return true;
    }
    else {
        return false;
    }
}



$(document).ready(function() {
  // $('#track').css({'display': 'none'});

  getItems('/delivered');

  $('#in-transit').on('click', function(){getItems('/in-transit')});
  $('#delivered').on('click', function(){getItems('/delivered')});
  $('#all').on('click', function(){getItems('/all')});

  $('#item-list').on('click', '.item', function() {
    var item = $(this);
    var id = item.attr('id');
    $.ajax({
      url: '/details',
      method: 'get',
      data: {q: id},
      dataType: 'json',
      beforeSend: function () {
      timer = setTimeout(function () { $('.spinner').fadeIn(); }, 100);
      },
      complete: function () {
        clearTimeout(timer);
        $('.spinner').fadeOut();
      },
      success: function(results) {
        var hidden = $('<div class="hidden-data"></div>');
        $(results).each(function(index, result) {
          var lat = (result['latitude']);
          var lng = (result['longitude']);
          var address = (result['address']);
          var p = $('<p></p>');
          p.data('lat', lat);
          p.data('lng', lng);
          p.data('address', address);
          hidden.append(p);
        });
        item.append(hidden);
        getDetails(item);
      }
    });
  });

////////// Tracking Number Validation /////////////

  $('#q').bind('keyup blur', function(e) {
    var number = $('#spnTrNrStatus');
    var button = $('#create-btn');
    if (validateUspsTracking('q')) {
      number.html('Valid');
      button.css('background-color', '#9DE293');
    }
    else {
      number.html('Invalid number');
      button.css('background-color', '#E74646');
    }
  });


/////// AJAX for adding a new tracking number ///////

  $('#add-number').on('click', function() {
    var input = $('#track');
    // input.animate({
    //   opacity: 'toggle'
    // }, 400);
    if (input.hasClass('hidden')){
      input.removeClass('hidden');
      input.hide().fadeIn(300);
    } else {
      input.addClass('hidden');
      input.fadeOut(300);
    };
  });

///// SAVING NEW item to the user accoutn /////
  $('#new-tracking').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var input = $('#q').val();
    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: {q: input},
      dataType: 'json',
      beforeSend: function() {
      timer = setTimeout(function () { $('.spinner2').fadeIn(); }, 100);
      },
      complete: function() {
        clearTimeout(timer);
        $('.spinner2').fadeOut();
      },
      success: function() {
        getItems('/all');
      }
    });
  });

  ///// DISPLAY single item without Login //////
  $('#without-signin').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var input = $('#q').val();
    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: {q: input},
      dataType: 'json',
      beforeSend: function() {
        timer = setTimeout(function() {$('.spinner2').fadeIn();}, 100);
      },
      complete: function() {
        clearTimeout(timer);
        $('.spinner2').fadeOut();
      },
      success: function(result) {
        var list = $('#item-list');
        list.html('');
        var item = $('<div class="item single-item"></div>');
        var trackDetails = $('<div class="track-details"></div>');
        var hidden = $('<div class="hidden-data"></div>');
        var details = result['details'];
        var locations = result['locations'];
        list.append(item);
        item.append($('<p>' + result["tracking_id"] + '</p>'));
        item.append($('<span>' + result["summary"] + '</span>'));
        item.append(hidden);

        $(details).each(function(index, detail) {
          trackDetails.append($('<p class="tr-detail">' + detail + '</p>'));
        });

        item.append(trackDetails);

        $(locations).each(function(index, detail) {
          var lat = detail[0];
          var lng = detail[1];
          var address = detail[2];
          // var address = (result['address']);
          var p = $('<p></p>');
          p.data('lat', lat);
          p.data('lng', lng);
          p.data('address', address);
          hidden.append(p);
          // debugger;
        });
      }
    });
  });


  // $('#track').on('click', function(){
  //   $('#track').fadeOut(200);
  //   $('#contact_container').delay(300).slideDown(200);

  // });
}); // end of doc ready
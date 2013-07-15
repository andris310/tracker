var timer;
var markers = [];
var latlngs = [];
var polyline;

var map = L.map('map').setView([38.737, -93.923], 5);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function clearDetails() {
  $(markers).each(function(index, marker){
    map.removeLayer(marker);
  });
  $(latlngs).each(function(index, latlng) {
    map.removeLayer(polyline);
  });
}


function getDetails(item) {
  clearDetails();

  markers = [];
  latlngs = [];
  item.find('.hidden-data p').each(function(index, point){
    var pt = $(point);
    var lat = pt.data('lat');
    var lng = pt.data('lng');
    var marker = L.marker([lat, lng]).addTo(map)
          .bindPopup(pt.data('address') + '\n')
          .openPopup();
    latlngs.push([lat, lng]);
    markers.push(marker);
    map.panTo([lat, lng], 9);
  });
  polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
};



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
        list.append(item);
        item.attr('id', result['id']);
        item.append($('<p class="number">' + num + '</p>' + '<a class="more-info"><span></span></a>'));
        // item.append($('<a class="more-info"><span></span></a>'));
        item.append($('<hr/>'));
        item.append($('<span>' + summary + '</spna>'));
        item.append($('<a class="remove"><span></span></a>'));
      });
    }
  });
};

////  Tracking number Validation Criteria ////////

function validateUspsTracking (tracking_nr) {
  var nr = $('#q').val();
  // var filter = /^\d{22}$/;
  if ((/^\d{22}$/).test(nr)) {
    return true;
  }
  else if ((/^([L|l][N|n])\d{9}([U|u][S|s])$/).test(nr)) {
    return true;
  }
  else if ((/^([E|e][A|a])\d{9}([U|u][S|s])$/).test(nr)) {
    return true;
  }
  else if ((/^([E|e][C|c])\d{9}([U|u][S|s])$/).test(nr)) {
    return true;
  }
  else if ((/^([C|c][P|p])\d{9}([U|u][S|s])$/).test(nr)) {
    return true;
  }
  else if ((/^([R|r][A|a])\d{9}([U|u][S|s])$/).test(nr)) {
    return true;
  }
  else {
    return false;
  }
}



$(document).ready(function() {

  getItems('/delivered');

  $('#in-transit').on('click', function(){getItems('/in-transit')});
  $('#delivered').on('click', function(){getItems('/delivered')});
  $('#all').on('click', function(){getItems('/all')});

  $('#item-list').on('click', '.item', function() {
    var item = $(this);
    var id = item.attr('id');
    var map = $('#map');

    if (map.hasClass('blur')) {
      map.removeClass('blur');
    };

    if (!(item.has('.hidden-data').length > 0)) {
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
        },
        error: function () {
          $('.error').slideDown();
          setTimeout(function () { $('.error').slideUp(); }, 3000);
        }
      });
    }; /// end of 'if' statement
    getDetails(item);
  });

////////// Tracking Number Validation /////////////

  $('#q').bind('keyup blur', function(e) {
    var number = $('#spnTrNrStatus');
    var button = $('#create-btn');
    if (validateUspsTracking('q')) {
      number.html('Valid');
      button.css({
        'background-color': '#9DE293',
        'border': '1px solid #9DE293'
      });
    }
    else {
      number.html('Invalid number');
      button.css({
        'background-color': '#E74646',
        'border': '1px solid #E74646'
      });
    }
  });





/////// Show or hide Add Tracking number field ///////

  $('#add-number').on('click', function() {
    var input = $('.track1');
    var field = $('#q');
        field.val('');
    if (input.hasClass('hidden')){
      input.removeClass('hidden');
      input.hide().fadeIn(300)
      // .css('width', '14.5em');
    } else {
      input.addClass('hidden');
      input.fadeOut(300);
    };
  });

///// SAVING NEW item to the user account /////
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
      },
      error: function () {
        $('.error').slideDown();
        setTimeout(function () { $('.error').slideUp(); }, 3000);
      }
    });
  });

  ////////// GET DETAILED INFO ////////
$('#item-list').on('click', '.more-info', function() {
  var item = $(this).parent();
  var id = item.attr('id');
  var trDetailsDiv = $('#track-detail-info');
  trDetailsDiv.animate({
        opacity: 0
      }, 300, function() {
          $.ajax({
            url: '/more-info',
            method: 'get',
            data: {q: id},
            dataType: 'json',
            success: function(results) {
              var trackDetails = $('#track-detail-info');
              trackDetails.html('');
              $(results).each(function(index, detail) {
                trackDetails.append($('<p class="tr-detail">' + detail.tracking_detail + '</p>'));
              });
            }
          });
      });

  trDetailsDiv.animate({
        opacity: 1
      }, 300);
});

  ////////// DELETE item //////////////
  $('#item-list').on('click', '.remove', function() {
    event.preventDefault();
    var item = $(this).parent();
    var id = item.attr('id');
    console.log(id);
    $.ajax({
      url: '/delete',
      method: 'delete',
      data: {q: id},
      success: function() {
        item.fadeOut(300);
        clearDetails();
      }
    }); //end of AJAX
  });


  ///// DISPLAY single item without Login //////
  $('#without-signin').on('submit', function(event) {
    /// Center New Form for landing page
    var newNumber = $('.new-number');
    newNumber.slideUp(200, function() {
      newNumber.addClass('track2 hidden').removeClass('new-number');
    });

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
        });
        getDetails(item);
        $('#map').removeClass('blur');
      },
      error: function () {
        $('.error').slideDown();
        setTimeout(function () { $('.error').slideUp(); }, 3000);
      }
    });
  });
}); // end of doc ready
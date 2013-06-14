var timer;

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
        item.append($('<p>' + num + '</p>'));
        item.append($('<span>' + summary + '</spna>'));
      });
    }
  });
}


$(document).ready(function() {

  getItems('/delivered');

  $('#in-transit').on('click', function(){getItems('/in-transit')});
  $('#delivered').on('click', function(){getItems('/delivered')});
  $('#all').on('click', function(){getItems('/all')});

  $('#item-list').on('click', '.item',function() {
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
      }
    });
  });
  // AJAX for adding a new tracking number

  $('#add-number').on('click', function() {
    $('#track').toggleClass('hidden');
  });

  $('#new-tracking').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var input = $('#q').val();
    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: {q: input},
      dataType: 'json',
      beforeSend: function () {
      timer = setTimeout(function () { $('.spinner2').fadeIn(); }, 100);
      },
      complete: function () {
        clearTimeout(timer);
        $('.spinner2').fadeOut();
      }
    });
  });
}); // end of doc ready
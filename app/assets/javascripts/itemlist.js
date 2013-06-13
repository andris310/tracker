
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
        item.append($('<p>' + num + '</p>'));
        item.append($('<span>' + summary + '</spna>'));
      });
    }
  });
}


$(document).ready(function() {

  var timer;
// Load 'Delivered' Items in to the window
  $.ajax({
    url: '/delivered',
    method: 'get',
    dataType: 'json',
    beforeSend: function () {
        timer = setTimeout(function () { $('.spinner').fadeIn(); }, 1000);
      },
    complete: function () {
        clearTimeout(timer);
        $('.spinner').fadeOut();
      },
    success: function(results) {
      var list = $('#item-list');
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

  $('#in-transit').on('click', function(){getItems('/in-transit')});
  $('#delivered').on('click', function(){getItems('/delivered')});
  $('#all').on('click', function(){getItems('/all')});

  // $('.item').on('click',function() {
  //   console.log($(this).attr('id'));
  // });
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
      dataType: 'json'
    });
  });


}); // end of doc ready
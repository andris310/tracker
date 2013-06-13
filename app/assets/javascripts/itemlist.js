$(document).ready(function() {

  $('#track').hide();

  $('#add-number').on('click', function() {
    $('#track').toggle();
  });

  $.ajax({
    url: '/delivered',
    method: 'get',
    dataType: 'json',
    success: function(results) {
      var list = $('#item-list');
      // debugger;
      $(results).each(function(index, result) {
        var num = result['tracking_id'];
        var sumarry = result['tracking_summary'];
        var delivered = result['status'];
      });
    }
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


});
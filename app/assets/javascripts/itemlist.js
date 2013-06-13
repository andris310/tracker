$(document).ready(function() {
  $('#track').hide();
  $('#add-number').on('click', function() {
    $('#track').toggle();
    // $('#track').hide('slide', {direction:'right'},1000);
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
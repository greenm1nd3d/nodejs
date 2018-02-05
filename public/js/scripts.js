$(document).ready(function() {
  $('.delete-user').on('click', function() {
    var id = $(this).attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/users/delete/' + id
    }).done(function(response) {
      // not working yet
      window.location.replace('/');
    });
    window.location.replace('/');
  });
});

var socket = io();
jQuery('#submitButton').on('click', validate);

function validate() {
  var username = jQuery('#username').val();
  var password = jQuery('#password').val();

  var userData = {
    username,
    password
  }

  console.log(userData);

  socket.emit('login', userData);

  socket.on('wrongPassword', function (data) {
    jQuery('.errorMessage').css("display", "block");
  });

  socket.on('noUser', function (data) {
    jQuery('.errorMessage').css("display", "block");
  });

  socket.on('changeToDashboard', function (data) {
    window.location.href='/dashboard';
  });
}

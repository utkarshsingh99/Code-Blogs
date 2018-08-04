var socket = io();

var user = {};

socket.on('post', function (data) {
  user = data;
});

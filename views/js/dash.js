var socket = io();
jQuery('#signOut').on('click', signOut);

function signOut () {
    socket.emit('signOut');
    socket.on('redirectHome', function (data) {
      window.location.href = '/';
    });
}

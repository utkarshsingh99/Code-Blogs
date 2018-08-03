var socket = io();
var form = jQuery('#signupForm');

function validate() {
  // var XHR = new XMLHttpRequest();
  var name = jQuery('#name').val();
  var username = jQuery('#username').val();
  var email = jQuery('#email').val();
  var password = jQuery('#password').val();
  var passwordAgain = jQuery('#passwordAgain').val();
  if(password !== passwordAgain) {
    return alert('Passwords do not match!');
  }
  if(password.length < 6){
    return alert('Password length should be at least 6 characters');
  }
  if(/^[a-zA-Z0-9- ]*$/.test(password) == false) {
    return alert('Password should contain at least one special character');
  }
  if(!email.includes('.com')) {
    return alert('Email is not valid!');
  }
  var signUpData = {
    name,
    username,
    email,
    password
  }

  socket.emit('signup', signUpData);

  socket.on('changeToDashboard', (data) => {
    window.location.href='/dashboard';
  });


  // socket.on('connect', function () {
  //   console.log(`Connected`);
  // });
  //
  // XHR.addEventListener('load', function () {
  //   console.log(`Success`);
  // });
  // XHR.addEventListener('error', function (e) {
  //   console.log(e);
  // });
  //
  // XHR.open('POST', '/validate');
  // XHR.setRequestHeader('Content-Type', 'application/json');
  // signUpData = JSON.stringify(signUpData);
  // console.log(signUpData);
  // XHR.send(signUpData);
  // console.log(XHR);
}

jQuery('#submitButton').on('click', validate);

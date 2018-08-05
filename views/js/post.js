var socket = io();

var user = {};

socket.on('post', function (data) {
  user = data;
  console.log(user);
});

socket.on('afterPost', function (data) {
  window.location.href = '/dashboard';
});

jQuery('#postIt').on('click', post);

function post () {
  var postTitle = jQuery('#postTitle').val();
  var post = jQuery('#post').val();

  if(postTitle === "" && post === "") {
    return errorMessage();
  }

  Object.assign(user, {posts: [
      post,
      postTitle
  ]})
    // user.posts.post = post;
    // user.posts.postTitle = postTitle;

  socket.emit('postData', user);
}

function errorMessage () {
  return alert('Please enter Post Title and Post');
}

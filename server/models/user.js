var mongoose = require('mongoose');

var Users = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    minlength: 1,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    minlength: 1
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 6
  },
  username: {
    type: String,
    trim: true,
    required: true,
    minlength: 1
  },
  numberOfPosts: {
    type: Number,
    default: 0
  },
  img: {
    data: Buffer,
    contentType: String
  },
  posts: {
    type: [postSchema]
  }
});

var postSchema = new mongoose.Schema({
  post: {
    type: String,
    default: ""
  },
  postTitle: {
    type: String,
    default: ""
  }
});

var User = mongoose.model('User', Users);

module.exports = {User}

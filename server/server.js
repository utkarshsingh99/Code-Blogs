var hbs = require('hbs');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const crypto =require('crypto');
const http = require('http');
const fs = require('fs');

const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

var app = express();
var path1 = path.join(__dirname,'..', 'views');
var path2 = path.join(__dirname, '..', 'views', 'partials');

var WebimgPath = '/images/profile.jpg';
var imgPath = path.join(__dirname, '..', 'views', 'images', 'profile.jpg');

var server = http.createServer(app);
var io = socketIO(server);
app.use(bodyParser.json());
app.set('view engine', 'hbs');
hbs.registerPartials(path2);
app.use(express.static(path1));

var loggedIn = false;
const secret = 'dontchangethis';
var currentUser = {
  name: "",
  username: "",
  numberOfPosts: 0,
  posts: {
    post: "",
    postTitle: ""
  }
}

function addUserCredentials(user) {
  currentUser.name = user.name;
  currentUser.numberOfPosts = user.numberOfPosts;
  currentUser.username = user.username;
}

app.get('/', (req, res) => {
  res.render('home');
});

io.on('connection', (socket) => {

  socket.on('signup', (userData) => {
    var user = new User(userData);
    console.log(`Socket server accepted`);
      User.findOne({username: userData.username}, (e, docs) => {
        if(docs) {
          socket.emit('userExists');
        } else {
          user.password = crypto.createHmac('sha256', user.password).update(secret).digest('hex');
          addUserCredentials(user);
          user.save();
          loggedIn = true;
          socket.emit('changeToDashboard', {location: '/dashboard'});
        }
      });
  });

  socket.on('login', (userData) => {
    var user = new User(userData);
    User.findOne({username: userData.username}, (e, docs) => {
      if(docs) {
        user.password = crypto.createHmac('sha256', user.password).update(secret).digest('hex');
        if(docs.password === user.password) {
          addUserCredentials(docs);
          socket.emit('changeToDashboard', {location: '/dashboard'});
          loggedIn = true;
        } else {
          socket.emit('wrongPassword');
        }
      } else {
        socket.emit('noUser');
      }
    });

    socket.on('addImage', (userData) => {
      var user = new User(userData);
      User.findOne({username: userData.username}, (e, docs) => {
        if(docs) {
          // TODO: Upload Image Code
          user.img.data = fs.readFileSync(imgPath);
          user.img.contentType = 'image/png';
          user.save();
        }
      });
    })
  });

  socket.on('signOut', (userData) => {
    loggedIn = false;
    user = {
      name: "",
      numberOfPosts: 0
    };
    addUserCredentials(user);     //Resets currentUser Object
    socket.emit('redirectHome');
  });

  socket.on('postData', (data) => {
    console.log(data);
    var user = data;
    User.findOne({username: user.username}, (e, docs) => {
      docs.posts.push(user.posts);
      docs.save();
      currentUser.posts = docs.posts;
      socket.emit('afterPost', user);
    });
  });

  // socket.emit('post', currentUser);
});

app.get('/dashboard', (req, res) => {
  if(loggedIn) {
    res.render('dashboard', {
      name: currentUser.name,
      numberOfPosts: currentUser.numberOfPosts,
      imgPath : WebimgPath,
      posts: currentUser.posts
    });
  } else {
      res.sendStatus(404);
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/postc', (req, res) => {
  io.on('connection', (socket) => {
    socket.emit('post', currentUser);
  });
  if(loggedIn){
    res.render('postc', {
      name: currentUser.name
    });
  }
});

server.listen(3000, () => {
  console.log(`Port up and running`);
});

/* TODO: Block Sign Up and Login page once user is logged In */

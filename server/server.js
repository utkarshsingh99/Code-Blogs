var hbs = require('hbs');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const crypto =require('crypto');
const http = require('http');

const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

var app = express();
var path1 = path.join(__dirname,'..', 'views');
var path2 = path.join(__dirname, '..', 'views', 'partials');

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
  numberOfPosts: 0
}

function addUserCredentials(user) {
  currentUser.name = user.name;
  currentUser.numberOfPosts = user.numberOfPosts;
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
          socket.emit('changeToDashboard', {location: '/dashboard'});
          loggedIn = true;
        }
      });
  });

  socket.on('login', (userData) => {
    var user = new User(userData);
    User.findOne({username: userData.username}, (e, docs) => {
      if(docs) {
        console.log(`Username Matches`);
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
  });

  socket.on('signOut', (userData) => {
    loggedIn = false;
    user = {
      name: "",
      numberOfPosts: 0
    };
    addUserCredentials(user);
    socket.emit('redirectHome');
  });
});

app.get('/dashboard', (req, res) => {
  if(loggedIn) {
    res.render('dashboard', {
      name: currentUser.name,
      numberOfPosts: currentUser.numberOfPosts
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
  res.render('postc');
});

server.listen(3000, () => {
  console.log(`Port up and running`);
});

/* TODO: Block Sign Up and Login page once user is logged In */

// app.post('/validate', (req, res) => {
//     // var user = new User(req.body);
//     var user = req.body;
//     users.create(user ,function(err, data){
//       users.findOne({username: user.username}, (e, docs) => {
//         if(docs) {
//           console.log(docs);
//         } else {
//           data.save();
//           res.send('One');
//         }
//        });
//     });
// });

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
var {bigString} = require('./utils/dashboard');

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

app.get('/', (req, res) => {
  res.render('home');
});

io.on('connection', (socket) => {

  socket.on('signup', (userData) => {
    var user = new User(userData);
    console.log(`Socket server accepted`);
      User.findOne({username: userData.username}, (e, docs) => {
        if(docs) {
          console.log(docs);
        } else {
          user.save();
          socket.emit('changeToDashboard', {location: '/dashboard'});
          loggedIn = true;
        }
      });
  });
});

app.get('/dashboard', (req, res) => {
  if(loggedIn) {
    res.render('dashboard');
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});



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

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/postc', (req, res) => {
  res.render('postc');
});

server.listen(3000, () => {
  console.log(`Port up and running`);
});


// passport.use(new LocalStrategy(
//   function (name, username, email, password, done) {
//     User.find({ where: {email: email} }).success(function (user) {
//       if(!user) {
//         var today = new Date();
//         var salt = today.getTime();
//
//         var newPass = crypto.hashPassword(password, salt);
//
//         var user = User.build({
//           email,
//           username,
//           name,
//           password: newPass
//         });
//
//         user.save().success(function (savedUser) {
//           console.log(`Saved user: ${savedUser}`);
//           return done(null, savedUser);
//         }).error((e) => {
//           console.log(e);
//           return done(null, false, {message: 'Something went wrong'});
//         });
//       }
//     })
//   }
// ));

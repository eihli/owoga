var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var getCsv = require('./baseball/GetCsv').getCsv;

// This mongodb stuff needs to be cleaned up.
// Kind of like ExpressJS makes using NodeJS
// easier, I think I can use something like
// Mongoose to make using MongoDB easier.
var mongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

// This variable is only used on the /chat page.
// It seems weird having it in app.js. I feel like I need
// to separate out each of the different apps.
// Don't know how though.
var active_users = [];

// You'll have to google this for details but
// you can set a node global variable that
// tells the server what type of environment it is
// and have code do different things based on what
// that variable is.
if (process.env.NODE_ENV == 'production)')
  var port = 80;
else
  var port = 3001;

mongoClient.connect("mongodb://localhost:27017/test", function(err, db){
  if(!err){
    console.log("We are connected");
  }
  // Yes, this tries to create a new collection
  // every time the server is run. But if the collection
  // already exists, it just ignores the command.
  db.collection('messages');
});

// I think I can connect to other databases on the same
// mongod process by just doing a:
// var other_db = new Db('other_db', new Server...)
// The Db object can be reused.
var db = new Db('test', new Server('localhost', 27017));
db.open(function(){}); // What is purpose of this anonymous functio?

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = 'true'; // What does this do?
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


io.on('connection', function(client){
  console.log('Client connected...');
  console.log(client.username);
  if (client.username === undefined){
    client.username = 'Anonymous';
  }
  console.log(client.username);
  client.on('new user', function(username){
    active_users.push(username);
    console.log(active_users);
    client.username = username;
    io.emit('update user list', active_users);
    db.collection('messages').find().sort({_id:-1}).limit(20).toArray(function(err, messages){
      client.emit('new message', messages);
    });
  });
  client.on('new message', function(msg){
    db.collection('messages').insert({name: client.username, message: msg});
    messages = db.collection('messages').find().sort({_id:-1}).limit(20).toArray(function(err, messages){
      io.emit('new message', messages);
    });
  });
  client.on('disconnect', function(){
    active_users.splice(active_users.indexOf(client.username), 1);
    console.log('Client disconnected...');
    io.emit('update user list', active_users);
  });
});


app.get('/', function(req, res) {
  res.render('index', {home: true, title: 'Owoga'}, function(err, html){
    res.send(html);
  });
});

app.get('/baseball/rankings/:file', function(req, res) {
  var file = req.params.file;
  console.log('request for: ' + file);
  res.sendfile(__dirname + '/baseball/rankings/' + file);
});

var date = new Date();
var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
app.get('/baseball', function(req, res) {
  getCsv(key, function(files) {
      res.render('baseball', {'files': files});
  });
});

app.get('/chat', function(req, res){
  res.render('chat');
});

app.use('/twidder', express.static(__dirname + '/twittler'));

// app.get('/twidder', function(req, res){
//   res.render('twidder');
// });
app.get('/upperscore', function(req, res){
  res.render('upperscore');
});

server.listen(port);

// view engine setup
module.exports = app;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var active_users = [];
var chatroom_data = {
  active_users: [],
  messages: [],
}
var messages;
if (process.env.NODE_ENV == 'production)')
  var port = 80;
else
  var port = 3001;

// var routes = require('./routes/index');
// var users = require('./routes/users');

mongoClient.connect("mongodb://localhost:27017/test", function(err, db){
  if(!err){
    console.log("We are connected");
  }
  db.createCollection('messages', function(err, collection){});
});

var db = new Db('test', new Server('localhost', 27017));
db.open(function(){});

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = 'true';
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


io.on('connection', function(client){
  console.log('Client connected...');
  if (client.username == undefined){
    client.emit('new user', chatroom_data);
  }
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
app.get('/chat', function(req, res){
  res.render('chat')
});

app.get('/twidder', function(req, res){
  res.render('twidder')
});
app.get('/upperscore', function(req, res){
  res.render('upperscore')
});

server.listen(port);

// view engine setup
module.exports = app;
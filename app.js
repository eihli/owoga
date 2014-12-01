var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

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
  client.on('message', function(msg){
    console.log('message: ' + msg);
    io.emit('message', msg);
  })
  client.on('disconnect', function(){
    console.log('Client disconnected...');
  });
});

app.get('/', function(req, res) {
  res.render('index', {home: true, title: 'Owoga'}, function(err, html){
    res.send(html);
  });
});
app.get('/chat', function(req, res){
  console.log('/chat visited');
  res.render('chat')
})
app.post('/chat', function(req, res){
  res.render('chat');
  console.log(req.body);
})
app.get('/twidder', function(req, res){
  res.render('twidder')
})
app.get('/upperscore', function(req, res){
  res.render('upperscore')
})
//app.listen(3000);
server.listen(3000);

// view engine setup
module.exports = app;

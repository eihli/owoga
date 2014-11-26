var express = require('express');
var path = require('path');

// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = 'true';
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
  res.render('index', {home: true, title: 'Owoga'}, function(err, html){
    res.send(html);
  });
});
app.get('/chat', function(req, res){
  res.render('chat')
})
app.get('/twidder', function(req, res){
  res.render('twidder')
})
app.get('/upperscore', function(req, res){
  res.render('upperscore')
})
app.listen(3000);

// view engine setup
module.exports = app;

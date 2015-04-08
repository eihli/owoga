var zerorpc = require('zerorpc');
var client = new zerorpc.Client();
var fs = require('fs');
var _ = require('underscore');

var date = new Date();
var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
console.log("Key: " + key);

var getCsv = function() {
  
  var cache = {};

  return function(date, callback){
    console.log(cache);
    if (!_.has(cache, date)) {
      cache[date] = date;
      client.connect('tcp://127.0.0.1:4242');
      client.invoke('createCsv', function(err, res, more) {
        if (err) {
          console.error(err);
        } else {
          console.log('ran: ' + res);
          fs.readdir(__dirname + '/rankings/', function(err, files) {
            console.log('Not found in cache. ' + files);
            callback(files);
          });
        }
        if (!more) {
          console.log('done.');
        }
      });
    } else {
      fs.readdir(__dirname + '/rankings/', function(err, files) {
        console.log('Found in cache. ' + files);
        callback(files);
      });
    }
  }
};

exports.getCsv = getCsv();
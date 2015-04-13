// Connect to a zerorpc python server. Check the cache
// to see if we've already run the function for the day.
// Run the 'createCsv' function
// from that server if we haven't yet. 

var zerorpc = require('zerorpc');
var client = new zerorpc.Client();
var fs = require('fs');
var _ = require('underscore');

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
        for (key, value in this.cache) {
          console.log(key + ": " + value);
        }
        console.log('Found in cache. ' + files);
        callback(files);
      });
    }
  }
};

exports.getCsv = getCsv();
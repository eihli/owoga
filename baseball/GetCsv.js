var zerorpc = require('zerorpc');
var client = new zerorpc.Client();
var fs = require('fs');

exports.getCsv = function(callback) {
  var result = [];

  client.connect('tcp://127.0.0.1:4242');
  client.invoke('createCsv', function(err, res, more) {
    if (err) {
      console.error(err);
    } else {
      console.log('ran: ' + res);
      fs.readdir(__dirname + '/rankings/', function(err, files) {
        console.log(files);
        callback(files);
      });
    }
    if (!more) {
      console.log('done.');
    }
  });

};
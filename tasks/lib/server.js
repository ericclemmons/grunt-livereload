'use strict';

var fs   = require('fs');
var Path = require('path');
var LRWebSocketServer = require('livereload-server');
var debug = require('debug')('livereload:server');

var server = module.exports = new LRWebSocketServer({
  id:           "com.github.ericclemmons.grunt-livereload",
  name:         "grunt-livereload",
  version:      "1.0",
  protocols:    {
    monitoring: 7,
    saving:     1
  }
});

LRWebSocketServer.prototype.reload = function(path) {
  for (var key in server.connections) {
    var connection = server.connections[key];

    try {
      connection.send({
        command:  'reload',
        path:     path,
        liveCSS:  true
      });
    } catch(err) {
      debug("Error (%s): %s", connection.id, err.message);
    }
  }
};

server.on('connected', function(connection) {
  debug("Client connected (%s)", connection.id);
});

server.on('disconnected', function(connection) {
  debug("Client disconnected (%s)", connection.id);
});

server.on('command', function(connection, message) {
  debug("Received command %s: %j", message.command, message);
});

server.on('error', function(err, connection) {
  debug("Error (%s): %s", connection.id, err.message);
});

server.on('livereload.js', function(request, response) {
  debug("Serving livereload.js.");
  fs.readFile(Path.join(__dirname, 'res/livereload.js'), 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    response.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'text/javascript'});
    response.end(data);
  });
});

server.on('httprequest', function(url, request, response) {
  response.writeHead(404);
  response.end();
});

//!#/usr/local/bin/node

//var request = require('request');
//var program = require('commander');
//var colors = require('colors');
var http = require('http');

var log = function(msg) {
    console.log(" > cookie: ".magenta + msg);
}

/*
http.createServer(function(req, res) {
    
}).listen(1338, '127.0.0.1');
*/

var net = require('net');

var server = net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
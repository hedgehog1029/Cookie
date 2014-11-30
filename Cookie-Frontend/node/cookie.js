#!/usr/local/bin/node

var request = require('request');
//var program = require('commander');
var colors = require('colors');
var http = require('http');
var urlTools = require('url');
var fs = require('fs');

var log = function(msg) {
    console.log(" > cookie: ".magenta + msg);
}

http.createServer(function(req, res) {
    //console.log(JSON.stringify(urlTools.parse(req.url, true)));
    //console.log(JSON.parse(JSON.stringify(urlTools.parse(req.url, true))));
    var requestJson = JSON.parse(JSON.stringify(urlTools.parse(req.url, true)));
    
    if ( requestJson['query'] ) {
        //res.writeHead(200, {'Content-Type': 'text/json'});
        if ( requestJson['query']['modpack'] ) {
            if (fs.existsSync('./' + requestJson['query']['modpack'] + '.json')) {
                var repo = JSON.parse(fs.readFileSync('./' + requestJson['query']['modpack'] + '.json', 'utf8'));
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('{ "modpack": "' + requestJson['query']['modpack'] + '", "file": "' + repo['file'] + '", "minecraft": "' + repo['mcver'] + '", "forge": "' + repo['forge'] + '" }');
                log('Served modpack ' + requestJson['query']['modpack'].green + '.');
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Pack not found.');
            }
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Hey, that tickles! Stop it!\n');
        }
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Welcome to Cookie!\nThis page doesn\'t do much for you.\n \nInstead, it\'s used for requests for modpacks.')
    }
}).listen(1338, '127.0.0.1');
log('Server running at http://127.0.0.1:1338');

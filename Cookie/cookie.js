#!/usr/local/bin/node

var request = require('request');
//var program = require('commander');
var colors = require('colors');
var http = require('http');
var urlTools = require('url');
var fs = require('fs');
var crypto = require('crypto');

var log = function(msg) {
    console.log(" > cookie: ".magenta + msg);
}

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}


http.createServer(function(req, res) {
    //console.log(JSON.stringify(urlTools.parse(req.url, true)));
    //console.log(JSON.parse(JSON.stringify(urlTools.parse(req.url, true))));
    var requestJson = JSON.parse(JSON.stringify(urlTools.parse(req.url, true)));
    //log('debug: '.red + requestJson['pathname']);
    
    if ( requestJson['query'] ) {
        //res.writeHead(200, {'Content-Type': 'text/json'});
        if ( requestJson['query']['modpack'] ) {
            if (fs.existsSync('./' + requestJson['query']['modpack'] + '.json')) {
                var repo = JSON.parse(fs.readFileSync('./' + requestJson['query']['modpack'] + '.json', 'utf8'));
                res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
                res.end('{ "modpack": "' + requestJson['query']['modpack'] + '", "file": "' + repo['file'] + '", "minecraft": "' + repo['mcver'] + '", "forge": "' + repo['forge'] + '" }');
                log('Served modpack ' + requestJson['query']['modpack'].green + '.');
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Pack not found.');
            }
        } else if ( requestJson['pathname'] == "/listpacks" ) {
            log("served a" + "listpacks".green + " request");
            var list = fs.readFileSync('./packs.json');
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(list);
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Hey, that tickles! Stop it!\n');
        }
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Welcome to Cookie!\nThis page doesn\'t do much for you.\n \nInstead, it\'s used for requests for modpacks.')
    }
}).listen(1338);
log('JSON server running at http://127.0.0.1:1338');

var fileArray = new Array(); //yeah sorry I did it wrong but this works better for me

http.createServer(function(req, res) {
    var md5Json = JSON.parse(JSON.stringify(urlTools.parse(req.url, true)));
    
    var writeHashFile = function(array) {
        fs.writeFileSync('./packs/' + md5Json['query']['pack'] + '/mods.json', JSON.stringify(array));
        //log('array: ' + JSON.stringify(array));
        log('updated ' + 'mods.json'.green + ' of pack ' + md5Json['query']['pack'].green );
    }
    
    if (md5Json['query']['folder'] && md5Json['query']['pack']) {
        //if (fs.existsSync(md5Json['query']['folder'])) {
        fs.readdir('packs/' + md5Json['query']['pack'] + '/' + md5Json['query']['folder'], function(err, files) {
            if (err) log('not ok, '.red + err);
            files.forEach( function(file, index, array) {
                //log('index: ' + index);
                var hash = crypto.createHash('md5'), 
                stream = fs.createReadStream('packs/' + md5Json['query']['pack'] + '/' + md5Json['query']['folder'] + '/' + file);
                
                stream.on('error', function(err) {
                    log('not ok, ' + err);
                });

                stream.on('data', function (data) {
                    hash.update(data, 'utf8');
                });

                stream.on('end', function () {
                    //writeHashes(file, hash.digest('hex'));
                    fileArray.push({file: file, hash: hash.digest('hex')});
                    if ((array.length - 1) == index) {
                        writeHashFile(fileArray);
                    }
                });
                
                //log('length: ' + (array.length - 1) + ', index: ' + index);
            });
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('200 ok');
        });
        //} else {
            //log('not ok: no folder '.red + './packs/' + md5Json['query']['pack'] + '/' + md5Json['query']['folder']);
        //}
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('You didn\'t specify something! Oops.');
        log('debug: error 404');
    }
}).listen(1340);
log('MD5 server running at http://127.0.0.1:1340');

var express = require('express');
var http = require('http');
var redis = require('redis');
var shortlink = require('./genShortlink');
var urlClient = require('url');

var client = redis.createClient();
var app = express();

var config = {
    protocol: 'http:',
    hostname: 'localhost',
    port: 8080
};

app.use(express.static(__dirname + '/client'));

app.get('/save/:url', function(req, res) {
    var surl = req.params.url;
    console.log("Saving url %s...", surl); // Log
    var shrtlnk = shortlink.shortlink(surl);
    res.writeHead(200, {'Content-Type': 'application/json'});
    config.path = '/' + shrtlnk;
    console.log("Path is %s", config.path);
    var result = {
        status: "PENDING",
        url: urlClient.format(config) + config.path
    };
    console.log("Shortlink is: %s", result.url);
    client.exists(shrtlnk, function(error, exists){
        if(!exists){
            client.set(shrtlnk, surl, function(err, shortlink) {
                result.status = "OK";
                res.end(JSON.stringify(result));
            });
        } else {
            result.status = "OK-EXISTING";
            res.end(JSON.stringify(result));
        }
    });
});

app.get('/:surl', function(req, res) {
    client.get(req.params.surl, function(err, surl){
        console.log("Redirect to %s", surl);
        /*if(surl == null){
            res.writeHead(301, {location: '/'});
            res.end();
        } else {*/
            res.writeHead(301, {location: surl});
            res.end();
        //}
    });
});

http.createServer(app).listen(process.env.PORT || config.port, process.env.IP || config.hostname);
console.log("Listening on %s", urlClient.format(config));

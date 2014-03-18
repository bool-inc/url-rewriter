var http = require('http');

var express = require('express');
var redis = require('redis');

var client = redis.createClient();
var app = express();

app.use(express.static(__dirname + '/client'));

app.get('/:shortUrl', function(req, res) {
    client.get(req.params.shortUrl, function(err, url) {
        res.writeHead(301, {location: url});
        res.end();
    });
});

app.get('/save/:url', function(req, res) {
    client.set('', req.params.url);
});

http.createServer(app).listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");
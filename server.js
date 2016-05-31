var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    datetime = require('node-datetime'),
    MongoClient = require('mongodb').MongoClient;

app.use('/', express.static(__dirname + '/public'));
http.listen(process.env.PORT || 3000);

var url = 'mongodb://timonriemslagh:devroe@ds011870.mlab.com:11870/devroedb';
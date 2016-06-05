var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    datetime = require('node-datetime'),
    MongoClient = require('mongodb').MongoClient,
    path = require('path');;

app.use('/', express.static(__dirname + '/public'));
http.listen(process.env.PORT || 3000);

app.get('/sendmethisimage', function (req, res) {

    res.sendFile(path.join(__dirname, '/public', 'assets/img/homeimageCropped.jpg'));

});

console.log("server started");

var url = 'mongodb://timonriemslagh:devroe@ds011870.mlab.com:11870/devroedb';

// get lists and users when the server runs
var users = [];

// create index of keywords in references
MongoClient.connect(url, function(err, db) {
    db.collection('references', function(err, collection) {
        collection.ensureIndex({keywords: "text"});

        /*collection.find({$text: {$search: "\"test\" \"1\""}})
         .toArray(function(err, documents) {
         console.log(documents);
         });*/
    });
});

MongoClient.connect(url, function(err, db) {
    find(db, 'users', function(data) {
        users = data;
        db.close();
    });
});

var insertDocument = function(db, obj, callback) {
    db.collection('surveys').insertOne(obj, function(err, result) {
        console.log("Inserted a survey into the surveys collection.");
        callback();
    });
};

var insertRef = function(db, obj, callback) {
    db.collection('references').insertOne(obj, function(err, result) {
        console.log("Inserted a reference into the references collection.");
        callback();
    });
};

var find = function(db, collection, callback) {
    db.collection(collection)
        .find()
        .toArray(function(err, documents) {
            callback(documents);
        });
};

var findFirstFive = function(db, collection, username, callback) {
    db.collection(collection)
        .find({"name": username})
        .sort({ "dateTime": -1})
        .limit(5)
        .toArray(function(err, documents) {
            callback(documents);
        });
};

var findMostRecentRefs = function(db, collection, callback) {
    db.collection(collection)
        .find()
        .sort({ "created": -1})
        .limit(5)
        .toArray(function(err, documents) {
            callback(documents);
        });
};

var search = function(db, collection, searchTerm, callback) {
    db.collection(collection)
        .find({"offerteNumberLowerCase" : {$regex : searchTerm.toLowerCase()}})
        .toArray(function(err, documents) {
            callback(documents);
        });
};

io.on('connection', function(socket){

    MongoClient.connect(url, function(err, db) {
        find(db, 'lists', function(data) {
            socket.emit('setAllLists', {lists: data});
            db.close();
        });
    });

    socket.on('saveList', function(data) {
        var dt = datetime.create();
        var formatted = dt.format('m/d/Y H:M:S');
        var newObj = {name: data.user, dateTime: formatted, survey: data.arr, offerteNumber: data.offerteNumber, offerteNumberLowerCase: data.offerteNumber.toLowerCase(), client: data.client, clientLowerCase: data.client.toLowerCase(), address: data.address, addressLowerCase: data.address.toLowerCase()};

        MongoClient.connect(url, function(err, db) {
            insertDocument(db, newObj, function() {
                if(!err) {
                    socket.emit('saveSuccess');
                } else {
                    socket.emit('saveFailure');
                }
                db.close();
            });
        });
    });

    socket.on('search', function(searchData) {
        MongoClient.connect(url, function(err, db) {
            search(db, 'surveys', searchData.searchInput, function(data) {
                socket.emit('searchResults', { searchTerm: searchData.searchInput, results: data});
                db.close();
            });
        });

    });

    socket.on('getSurveys', function() {
        MongoClient.connect(url, function(err, db) {
            findFirstFive(db, 'surveys', "timon", function(data) {
                socket.emit('mostRecent', data);
                db.close();
            });
        });
    });

    socket.on('getMostRecentRefs', function() {
        MongoClient.connect(url, function(err, db) {
            findMostRecentRefs(db, 'references', function(data) {
                socket.emit('mostRecentRefs', data);
                db.close();
            });
        });
    });

    socket.on('saveRef', function(data) {
        var dt = datetime.create();
        var formatted = dt.format('m/d/Y H:M:S');
        data.created = formatted;

        MongoClient.connect(url, function(err, db) {
            insertRef(db, data, function() {
                if(!err) {
                    socket.emit('saveSuccessRef');
                } else {
                    socket.emit('saveFailureRef');
                }
                db.close();
            });
        });
    });


    socket.on('disconnect', function() {
        console.log("disconnected");
    });
});
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    MongoClient = require('mongodb').MongoClient,
    path = require('path'),
    fs = require('fs');

var ObjectId = require('mongodb').ObjectId;

app.use('/', express.static(__dirname + '/public'));
http.listen(process.env.PORT || 3000);

app.get('/sendmethisimage', function (req, res) {

    res.sendFile(path.join(__dirname, '/public', 'assets/img/homeimageCropped.jpg'));

});

console.log("server started");

var url = 'mongodb://timonriemslagh:devroe@ds011870.mlab.com:11870/devroedb';

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

var updateListItem = function(listItem, callback) {

    MongoClient.connect(url, function(err, db) {

        db.collection('listItems').update(
            {
                title: listItem.title
            },
            {
                $set: {
                    title: listItem.title,
                    image: listItem.photoUrl
                }
            },
            {
                upsert: true
            },
            callback(err)
        );
    });
};

var insertRef = function(ref, callback) {

    MongoClient.connect(url, function(err, db) {

        db.collection('references').insert(
            {
                keywords: ref.keywords,
                image: ref.photoUrl
            }
            ,
            callback(err)
        );
    });
};

var insertList = function(list, callback) {

    MongoClient.connect(url, function(err, db) {

        db.collection('lists').insert(
            {
                title: list.title,
                items: list.items
            }
            ,
            callback(err)
        );
    });
};

var updateLink = function(listItem, callback) {

    MongoClient.connect(url, function(err, db) {

        db.collection('listItems').update(
            {
                _id: new ObjectId(listItem.listItem)
            },
            {
                $set: {
                    listId: listItem.link
                }
            },
            {
                upsert: true
            },
            callback(err)
        );
    });
};


io.on('connection', function(socket){

    socket.on('getListItems', function() {
        var listItems = [];

        MongoClient.connect(url, function(err, db) {

            db.collection('listItems')
                .find({ }, { title: 1 })
                .toArray(function(err, arr) {
                    arr.forEach(function(el){
                            listItems.push(el.title)
                        });
                    socket.emit('allListItems', listItems);
                });

        });
    });

    socket.on('validateListItem', function(data) {

        MongoClient.connect(url, function(err, db) {

            db.collection('listItems', function(err, collection) {
                collection.ensureIndex({title: "text"});

                collection.find({$text: {$search: data.text }})
                    .toArray(function(err, arr) {
                        if(!err) {

                            if(arr.length > 0) {
                                socket.emit('validation', { validated: true, oid: arr[0]._id, index: data.index });
                            } else {
                                socket.emit('validation', { validated: false, index: data.index });
                            }
                        }
                        db.close();
                    });
            });
        });

    });

    socket.on('saveRef', function(data) {

        var newPath = __dirname + "/uploads/" + data.photoUrl;

        console.log(newPath);

        fs.writeFile(newPath, data.photo, function (err) {
            if(err) {
                console.log(err);
            } else {
                console.log("saved at " + newPath);
            }
        });

        insertRef({keywords: data.keywords, photoUrl: newPath}, function(err) {
            if(err) {
                console.log("error: ", err);
            }

            socket.emit('saveRefFeedback', err);
        });
    });

    socket.on('saveListItem', function(data) {

        var newPath = __dirname + "/uploads/" + data.photoUrl;

        console.log(newPath);

        fs.writeFile(newPath, data.photo, function (err) {
            if(err) {
                console.log(err);
            } else {
                console.log("saved at " + newPath);
            }
        });

        updateListItem({title: data.title, photoUrl: newPath}, function(err) {
            if(err) {
                console.log("error: ", err);
            }

            socket.emit('saveListItemFeedback', err);
        });

    });

    socket.on('saveList', function(data) {

        var newListId = new ObjectId();

        insertList({title: data.title, items: data.items, id: newListId}, function(err) {

            console.log(err);

            if(!err) {
                console.log("list saved");
            }

            socket.emit('saveListFeedback', err);

        });

        updateLink({listItem: data.link, link: newListId}, function(err) {

            console.log(err);

            if(!err) {
                console.log("list item linked");
            }

            socket.emit('updateLinkFeedback', err);

        });

    });

    MongoClient.connect(url, function(err, db) {
        find(db, 'lists', function(data) {
            socket.emit('setAllLists', {lists: data});
            db.close();
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

    socket.on('disconnect', function() {
        console.log("disconnected");
    });
});

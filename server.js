var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    datetime = require('node-datetime'),
    MongoClient = require('mongodb').MongoClient,
    path = require('path'),
    dl  = require('delivery'),
    fs = require('fs');

var ObjectId = require('mongodb').ObjectId;

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

var insertDocument = function(db, obj, collection, callback) {
    db.collection(collection).insertOne(obj, function(err, result) {
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

io.on('connection', function(socket){

    socket.on('validateListItem', function(data) {

        MongoClient.connect(url, function(err, db) {

            db.collection('listItems', function(err, collection) {
                collection.ensureIndex({title: "text"});

                collection.find({$text: {$search: data.text }})
                    .toArray(function(err, arr) {
                        if(!err) {
                            if(arr.length > 0) {
                                socket.emit('validation', { validated: true, index: data.index });
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

    socket.on('saveNewList', function(data) {

        var errs = [];

        //var photos = JSON.parse(JSON.stringify(data));

        data.photos.forEach(function(photo) {

            var newPath = __dirname + "/uploads/" + photo.fileName;

            fs.writeFile(newPath, photo.data, function (err) {
                if(err) {
                    errs.push(err);
                    //
                } else {
                    console.log("saved at " + newPath);
                }
            });

        });

        if(errs.length == 0) {

            var newList = {};
            var listItems = [];

            data.listItems.forEach(function(listItem) {
                var id = new ObjectId();
                listItem.id = id;
                listItems.push(id);

                updateListItem(listItem);
            });

            newList.title = []; // array of all the listItems
            newList.items = data.listItems;
            newList.id = new ObjectId();

            /*MongoClient.connect(url, function(err, db) {

                var results = db.lists.aggregate([
                    // Get just the docs that contain a shapes element where color is 'red'
                    {$match: {'items.title': 'Menuiserite'}},
                    {$project: {
                        items: {$filter: {
                            input: '$items',
                            as: 'itel',
                            cond: {$eq: ['item.title', 'Menuiserite']}
                        }},
                        _id: 0
                    }}
                ]);

                console.log(results);
                db.close();

            });*/




            //find list where item is equal to the link, replace the listId with the newly generated id



            console.log(data.listItems);

            //insert the list in lists

            /*MongoClient.connect(url, function(err, db) {
                insertDocument(db, newObj, 'lists', function() {
                    if(!err) {
                        socket.emit('saveSuccess');
                    } else {
                        socket.emit('saveFailure');
                    }
                    db.close();
                });
            });*/

            //socket.emit('saveComplete');
        } else {
            socket.emit('fileSaveError', errs);
        }

        /*for(var photo in photos) {
            console.log(photo);
        }*/

        /*var newPath = __dirname + "/uploads/" + data.fileName;
        fs.writeFile(newPath, data.photo, function (err) {
            if(err) {
                console.log(err);
                socket.emit('fileSaveError', err);
            } else {
                socket.emit('saveComplete');
                console.log("saved at " + newPath);
            }
        });*/

    });

    socket.on('saveList', function(data) {

    });

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
            insertDocument(db, newObj, 'surveys', function() {
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

    socket.on('disconnect', function() {
        console.log("disconnected");
    });
});

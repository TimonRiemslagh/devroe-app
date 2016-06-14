var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    MongoClient = require('mongodb').MongoClient,
    path = require('path'),
    fs = require('fs');

app.use(express.static('public'));

http.listen(process.env.PORT || 3000, function() {
    console.log('server listening on port 3000...');
});

var jsonParser = bodyParser.json();

var url = 'mongodb://timonriemslagh:devroe@ds011870.mlab.com:11870/devroedb';

app.get('/lists', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        db.collection('lists', function (err, collection) {
            var listTitles = [];
            collection.find()
                .toArray(function (err, arr) {
                    arr.forEach(function (el) {
                        listTitles.push(el.title);
                    });
                    if (!err) {
                        res.json({items: arr, titles: listTitles});
                        db.close();
                    } else {
                        res.sendStatus(400);
                        db.close();
                    }
                });
        });
    });
});

app.get('/lists/:title', function(req, res) {

    var reqTitle = req.params.title;

    MongoClient.connect(url, function(err, db) {
        db.collection('lists').findOne({title: reqTitle}, function(err, doc) {

            if(doc) {
                res.json({validList: true});
            } else {
                res.json({validList: false});
            }

            db.close();
        });

    });

});

io.on('connection', function(socket){

    socket.on('saveList', function(data) {

        var listTitle = data.title;
        var listItems = [];

        data.items.forEach(function(item) {

            var newPath = __dirname + "/uploads/" + data.title.replace(/[^A-Z0-9]+/ig, "_") + "_" + item.title.replace(/[^A-Z0-9]+/ig, "_") + "_" + item.filename;

            fs.writeFile(newPath, item.image, function (err) {
                if(err) {
                    console.log("error");
                } else {
                    console.log("saved at " + newPath);
                }
            });

            listItems.push({title: item.title, link: item.link, url: newPath});

        });

        console.log(listItems);

        MongoClient.connect(url, function(err, db) {

            if(data.root){

                db.collection('lists').update(
                    {id: 0},
                    {id: 0, title: listTitle, items: listItems},
                    {upsert: true, new: true},
                    function(err, object) {

                        if(!err && object.result.ok) {
                            socket.emit("listSaved");
                            db.close();
                        } else {
                            socket.emit("listNotSaved", err);
                            db.close();
                        }

                    });

            } else {

                db.collection('lists').update(
                    {title: listTitle},
                    {title: listTitle, items: listItems},
                    {upsert: true, new: true},
                    function(err, object) {

                        console.log(object);

                        if(!err && object.result.ok) {
                            socket.emit("listSaved");
                            db.close();
                        } else {
                            socket.emit("listNotSaved", err);
                            db.close();
                        }

                    });
            }



        });

    });

    socket.on('saveRef', function(data) {

        var newPath = __dirname + "/uploads/" + data.keywords.replace(/[^A-Z0-9]+/ig, "_") + "_" + data.photoUrl;


        fs.writeFile(newPath, data.photo, function (err) {
            if(err) {
                console.log(err);
            } else {
                console.log("saved at " + newPath);
            }
        });

        MongoClient.connect(url, function(err, db) {

            db.collection('references').insert(
                {keywords: data.keywords, url: newPath},
                function(err, object) {

                    console.log(err, object);

                    if(!err && object.result.ok) {
                        socket.emit("refSaved");
                    } else {
                        socket.emit("refNotSaved", err);
                    }

                });
        });
    });

});

app.delete('/lists/:name', function(req, res) {

    console.log("delete");
    console.log(req.params.name);

    res.sendStatus(200);

});

app.put('/lists/:name', function(req, res) {

    console.log("put");
    console.log(req.body);
    console.log(req.files);

    res.sendStatus(200);

});

/*app.listen(process.env.PORT || 3000, function() {
    console.log('server listening on port 3000...');
});*/
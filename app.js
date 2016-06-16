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

app.get('/refs', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        db.collection('references').find()
            .toArray(function(err, arr) {

                if(!err) {
                    res.json(arr);
                    db.close();
                } else {
                    res.sendStatus(400);
                    db.close();
                }

            });
    });
});

app.get('/surveys', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        db.collection('surveys').find()
            .toArray(function(err, arr) {

                if(!err) {
                    res.json(arr);
                    db.close();
                } else {
                    res.sendStatus(400);
                    db.close();
                }

            });
    });
});

app.get('/lists/:title', function(req, res) {

    var reqTitle = req.params.title;

    MongoClient.connect(url, function(err, db) {
        db.collection('lists').findOne({title: reqTitle}, function(err, doc) {

            if(doc) {
                res.json({validList: true, doc: doc});
            } else {
                res.json({validList: false});
            }

            db.close();
        });

    });

});

app.get('/image/:url', function(req, res) {

    console.log(req.params.url);

});

app.post('/survey', jsonParser, function(req, res) {

    if (!req.body) {

        res.sendStatus(400);

    } else {

        MongoClient.connect(url, function(err, db) {
            db.collection('surveys').insert(
                {
                    offerteNumber: req.body.offerteNumber,
                    client: req.body.client,
                    address: req.body.address,
                    user: req.body.user,
                    options: req.body.arr
                },
                function(err, doc) {

                    console.log(doc.ops[0]);

                    if(!err && doc.result.ok) {
                        res.json({success: true, doc: doc.ops[0]});
                    } else {
                        res.json({success: false, err: err});
                    }

                    db.close();
                });

        });
    }
});

io.on('connection', function(socket){

    socket.on('saveList', function(data) {

        var listTitle = data.title;
        var listItems = [];

        data.items.forEach(function(item) {

            var newPath = "./public/uploads/" + data.title.replace(/[^A-Z0-9]+/ig, "_") + "_" + item.title.replace(/[^A-Z0-9]+/ig, "_") + "_" + item.filename;

            fs.writeFile(newPath, item.image, { flag: 'wx' }, function (err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("saved at " + newPath);
                }
            });

            listItems.push({title: item.title, link: item.link, linkUrl: item.linkUrl, url: newPath});

        });

        MongoClient.connect(url, function(err, db) {

            if(data.root){

                db.collection('lists').findAndModify(
                    {id: 0},
                    [],
                    {id: 0, title: listTitle, items: listItems},
                    {upsert: true, new: true},
                    function(err, object) {

                        if(!err && object.ok) {
                            socket.emit("listSaved", object.value);
                            db.close();
                        } else {
                            socket.emit("listNotSaved", err);
                            db.close();
                        }

                    });

            } else {

                if(data.id) {

                    db.collection('lists').findAndModify(
                        {_id: new ObjectId(data.id)},
                        [],
                        {title: listTitle, items: listItems},
                        {upsert: true, new: true},
                        function(err, object) {

                            if(!err && object.ok) {
                                socket.emit("listSaved", object.value);
                                db.close();
                            } else {
                                socket.emit("listNotSaved", err);
                                db.close();
                            }

                        });

                } else {

                    db.collection('lists').findAndModify(
                        {title: listTitle},
                        [],
                        {title: listTitle, items: listItems},
                        {upsert: true, new: true},
                        function(err, object) {

                            if(!err && object.ok) {
                                socket.emit("listSaved", object.value);
                                db.close();
                            } else {
                                socket.emit("listNotSaved", err);
                                db.close();
                            }

                        });

                }


            }



        });

    });

    socket.on('saveRef', function(data) {

        var newFileName = data.keywords.replace(/[^A-Z0-9]+/ig, "_") + "_" + data.filename;

        var newPath = "./public/uploads/" + newFileName;


        fs.writeFile(newPath, data.photo, { flag: 'wx' }, function (err) {
            if(err) {
                console.log(err);
            } else {
                console.log("saved at " + newPath);
            }
        });

        MongoClient.connect(url, function(err, db) {

            db.collection('references').findAndModify(
                {keywords: data.keywords},
                [],
                {keywords: data.keywords, url: '/uploads/' + newFileName},
                function(err, object) {

                    if(!err && object.result.ok) {
                        socket.emit("refSaved", object.value);
                        db.close();
                    } else {
                        socket.emit("refNotSaved", err);
                        db.close();
                    }

                });
        });
    });

});

app.delete('/lists/:id', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        db.collection('lists').remove(
            {_id: req.params.id},
            function(err, result) {

                if(!err && result.result.ok) {

                    res.json({success: true});

                } else {

                    res.json({success: false, err: err});

                }

                db.close();

            });
    });

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
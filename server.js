var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    MongoClient = require('mongodb').MongoClient,
    path = require('path'),
    fs = require('fs');

var ObjectId = require('mongodb').ObjectId;
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'log.txt' });
//winston.remove(winston.transports.Console);

app.use(express.static('public'));

var port = process.env.PORT || 3000;

http.listen(port, function() {
    winston.info('server listening on port ' + port);
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
                        //winston.info("API LISTS - send: " + JSON.stringify({items: arr, titles: listTitles}));
                        res.json({items: arr, titles: listTitles});
                        db.close();
                    } else {
                        winston.error("API LISTS - error: " + err);
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
                    //winston.info("API REFS - send: " + JSON.stringify(arr));
                    res.json(arr);
                    db.close();
                } else {
                    winston.error("API REFS - error: " + err);
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
                    //winston.info("API SURVEYS - send: " + JSON.stringify(arr));
                    res.json(arr);
                    db.close();
                } else {
                    winston.error("API SURVEYS - error: "+ err);
                    res.sendStatus(400);
                    db.close();
                }

            });
    });
});

app.get('/lists/:title', function(req, res) {

    var reqTitle = req.params.title;

    console.log(reqTitle);

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

app.post('/survey', jsonParser, function(req, res) {

    if (!req.body) {

        winston.error("API NEW SURVEY - no data");

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

                    if(!err && doc.result.ok) {
                        //winston.info('API NEW SURVEY - created: ' + JSON.stringify(doc.ops[0]));
                        res.json({success: true, doc: doc.ops[0]});
                    } else {
                        winston.error('API NEW SURVEY - error: ' + err);
                        res.json({success: false, err: err});
                    }

                    db.close();
                });

        });
    }
});

io.on('connection', function(socket){

    socket.on('saveList', function(data) {

        if(data) {

            var listTitle = data.title;
            var listItems = [];

            data.items.forEach(function(item) {

                var newPath = "./public/uploads/" + data.title.replace(/[^A-Z0-9]+/ig, "_") + "_" + item.title.replace(/[^A-Z0-9]+/ig, "_") + "_" + item.filename;

                fs.writeFile(newPath, item.image, { flag: 'wx' }, function (err) {
                    if(err) {
                        winston.error('API LIST FILE - error: ' + err);
                    } else {
                        //winston.info('API LIST FILE - file saved at: ' + newPath);
                    }
                });

                listItems.push({title: item.title, link: item.link, linkUrl: item.linkUrl, url: newPath});

            });

            console.log(listItems);

            MongoClient.connect(url, function(err, db) {

                if(data.root){

                    db.collection('lists').findAndModify(
                        {id: 0},
                        [],
                        {id: 0, title: listTitle, items: listItems},
                        {upsert: true, new: true},
                        function(err, object) {

                            if(!err && object.ok) {
                                //winston.info('API NEW LIST ROOT - created: ' + JSON.stringify({doc: object.value, updatedExisting: object.lastErrorObject.updatedExisting}));
                                socket.emit("listSaved", {doc: object.value, updatedExisting: object.lastErrorObject.updatedExisting});
                                db.close();
                            } else {

                                winston.error('API NEW LIST ROOT - error: ' + err);
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
                                    //winston.info('API NEW LIST ID - created: ' + JSON.stringify({doc: object.value, updatedExisting: object.lastErrorObject.updatedExisting}));
                                    socket.emit("listSaved", {doc: object.value, updatedExisting: object.lastErrorObject.updatedExisting});
                                    db.close();
                                } else {
                                    winston.error('API NEW LIST ID - error: ' + err);
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
                                    //winston.info('API NEW LIST - created: ' + JSON.stringify({doc: object.value, updatedExisting: object.lastErrorObject.updatedExisting}));
                                    socket.emit("listSaved", {doc: object.value, updatedExisting: object.lastErrorObject.updatedExisting});
                                    db.close();
                                } else {
                                    winston.error('API NEW LIST - error: ' + err);
                                    socket.emit("listNotSaved", err);
                                    db.close();
                                }

                            });

                    }

                }

            });

        } else {

            winston.error("API NEW LIST - no data");

            socket.emit("listNotSaved", "no data");
        }



    });

    socket.on('updateRef', function(data) {

        if(data) {
            var newFileName = "";

            if(data.keywords) {
                newFileName = data.keywords.replace(/[^A-Z0-9]+/ig, "_") + "_" + data.filename;
            }

            if(data.photo) {
                var newPath = "./public/uploads/" + newFileName;

                fs.writeFile(newPath, data.photo, { flag: 'wx' }, function (err) {
                    if(err) {
                        winston.error('API UPDATE REF FILE - error: ' + err);
                    } else {
                        //winston.info('API UPDATE REF FILE - file saved at: ' + newPath);
                    }
                });

            } else {


                if(data.url) {

                    MongoClient.connect(url, function(err, db) {

                        db.collection('references').findAndModify(
                            {_id: new ObjectId(data.id)},
                            [],
                            {keywords: data.keywords, url: data.url},
                            {new: true, upsert: true},
                            function(err, object) {

                                if(!err && object.ok) {
                                    //winston.info("API UPDATE REF - upated: " + JSON.stringify(object.value));
                                    socket.emit("refUpdated", object.value);
                                    db.close();
                                } else {
                                    winston.error("API UPDATE REF -  error: " + err);
                                    socket.emit("refNotSaved", err);
                                    db.close();
                                }

                            });
                    });

                }

            }
        } else {
            winston.error("API UPDATE REF - no data");
        }



    });

    socket.on('saveRef', function(data) {

        if(data) {
            var newFileName = "";

            if(data.keywords) {
                newFileName = data.keywords.replace(/[^A-Z0-9]+/ig, "_") + "_" + data.filename;
            }

            if(data.photo) {
                var newPath = "./public/uploads/" + newFileName;

                fs.writeFile(newPath, data.photo, { flag: 'wx' }, function (err) {
                    if(err) {
                        winston.error('API NEW REF FILE - error: ' + err);
                    } else {
                        //winston.info('API NEW REF FILE - file saved at: ' + newPath);
                    }
                });

            } else {
                winston.error("API REF FILE - no photo data found.");
            }

            MongoClient.connect(url, function(err, db) {

                db.collection('references').findAndModify(
                    {_id: new ObjectId(data.id)},
                    [],
                    {keywords: data.keywords, url: '/uploads/' + newFileName},
                    {new: true, upsert: true},
                    function(err, object) {

                        console.log(object);

                        if(!err && object.ok) {
                            //winston.info("API NEW REF - saved: " + JSON.stringify(object.value));
                            socket.emit("refSaved", object.value);
                            db.close();
                        } else {
                            winston.error("API NEW REF - error: " + err);
                            socket.emit("refNotSaved", err);
                            db.close();
                        }

                    });
            });
        } else {
            winston.error("API NEW REF - no data");
        }


    });

});

app.delete('/lists/:id', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        db.collection('lists').remove(
            {_id: new ObjectId(req.params.id)},
            function(err, result) {

                if(!err && result.result.ok) {
                    //winston.info('API REMOVE LIST - deleted: ' + JSON.stringify(result));
                    res.json({success: true});
                } else {
                    winston.error('API REMOVE LIST - error: ' + err);
                    res.json({success: false, err: err});
                }

                db.close();

            });
    });

});

app.delete('/refs/:id', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        db.collection('references').remove(
            {_id: new ObjectId(req.params.id)},
            function(err, result) {

                if(!err && result.result.ok) {
                    //winston.info('API REMOVE REF - deleted: ' + JSON.stringify(result));
                    res.json({success: true});

                } else {
                    winston.error('API REMOVE REF - error: ' + err);
                    res.json({success: false, err: err});
                }

                db.close();

            });
    });

});
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http').Server(app),
    MongoClient = require('mongodb').MongoClient,
    path = require('path'),
    fs = require('fs'),
    ObjectId = require('mongodb').ObjectId,
    aws = require('aws-sdk');

app.use(express.static('public'));
aws.config.update({accessKeyId: "AKIAJFRWG5Y2BTCC32LQ", secretAccessKey: "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"});

var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('server listening on port ' + port);
});

var jsonParser = bodyParser.json();
var url = 'mongodb://timonriemslagh:devroe@ds011870.mlab.com:11870/devroedb';

var basicAuth = require('express-basic-auth')

app.use(basicAuth({
    users: { 'admin': 'supersecret' }
}))

app.get('/lists', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        db.collection('lists', function (err, collection) {
            collection.find()
                .toArray(function (err, arr) {
                    if (!err) {
                        res.json(arr);
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
            .sort({date: -1})
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
            .sort({date: -1})
            .toArray(function(err, arr) {

                if(!err) {
                    res.json(arr);
                    db.close();
                } else {
                    console.log("API SURVEYS - error: "+ err);
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

app.post('/survey', jsonParser, function(req, res) {
    if (!req.body) {

        console.log("API NEW SURVEY - no data");

        res.sendStatus(400);

    } else {

        MongoClient.connect(url, function(err, db) {
            db.collection('surveys').insert(
                {
                    offerteNumber: req.body.offerteNumber,
                    client: req.body.client,
                    address: req.body.address,
                    remarks: req.body.remarks,
                    date: new Date(),
                    options: req.body.arr
                },
                function(err, doc) {

                    if(!err && doc.result.ok) {
                        res.json({success: true, doc: doc.ops[0]});
                    } else {
                        console.log('API NEW SURVEY - error: ' + err);
                        res.json({success: false, err: err});
                    }

                    db.close();
                });

        });
    }
});

app.post('/ref', jsonParser, function(req, res) {

    if (!req.body) {
        console.log('ref error');
        res.sendStatus(400);
    }

    MongoClient.connect(url, function(err, db) {

        db.collection('references').findAndModify(
            {
                _id: new ObjectId(req.body.id)
            },
            [],
            {keywords: req.body.keywords, url: req.body.url, date: new Date()},
            {upsert: true, new: true},
            function(err, doc) {

                if(!err && doc.ok) {
                    res.json({success: true, doc: doc.value, updated: doc.lastErrorObject.updatedExisting});
                } else {
                    res.json({success: false, err: err});
                }

                db.close();
            });

    });

});

app.post('/list', jsonParser, function(req, res) {
    if (!req.body) {
        console.log('list error');
        res.sendStatus(400);
    }

    MongoClient.connect(url, function(err, db) {

        db.collection('lists').findAndModify(
            {
                _id: new ObjectId(req.body.id)
            },
            [],
            {title: req.body.title, items: req.body.items, root: req.body.root, date: new Date()},
            {upsert: true, new: true},
            function(err, doc) {
                if(!err && doc.ok) {
                    res.json({success: true, doc: doc.value, updated: doc.lastErrorObject.updatedExisting});
                } else {
                    res.json({success: false, err: err});
                }

                db.close();
            });

    });

});

app.delete('/lists/:id', function(req, res) {

    MongoClient.connect(url, function(err, db) {

        db.collection('lists').remove(
            {_id: new ObjectId(req.params.id)},
            function(err, result) {

                if(!err && result.result.ok) {
                    res.json({success: true});
                } else {
                    console.log('API REMOVE LIST - error: ' + err);
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
                    res.json({success: true});

                } else {
                    console.log('API REMOVE REF - error: ' + err);
                    res.json({success: false, err: err});
                }

                db.close();

            });
    });

});

app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];

    const bucket = 'devroe';

    const s3Params = {
        Bucket: bucket,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if(err){
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${bucket}.s3.amazonaws.com/${fileName}`
        };

        res.write(JSON.stringify(returnData));
        res.end();
    });
});

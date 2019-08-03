var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const path = require('path');

const PrecioGasolina = path.join(__dirname, '../data/final.csv');
const csv = require('csvtojson')

// ************ INSERTAR DATOS EN MONGO DB//
exports.connectDB = function() {
    csv()
        .fromFile(PrecioGasolina)
        .then((jsonObj1) => {
            mongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
                if (err) throw err;
                var dbo = db.db("accidentes");
                dbo.collection("accidente").insertMany(jsonObj1, (err, res) => {
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                    db.close();
                });
            });
        })
}


exports.dayWeek = function(req, res) {
    gettodb([{
            $group: { _id: "$Day_of_Week", total: { $sum: 1 } }
        },
        {
            $sort: { total: -1 }
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

exports.ofensive = function(req, res) {
    gettodb([{
            $group: { _id: "$OFFENSE_TYPE_ID", total: { $sum: 1 } }
        },
        {
            $sort: { total: -1 }
        }, {
            $limit: 20
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

exports.district = function(req, res) {
    gettodb([{
            $group: { _id: "$DISTRICT_ID", total: { $sum: 1 } }
        },
        {
            $sort: { total: -1 }
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

exports.year = function(req, res) {
    gettodb([{
            $group: { _id: { $year: { $convert: { input: "$REPORTED_DATE", to: "date" } } }, total: { $sum: 1 } }
        },
        {
            $sort: { _id: 1 }
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

function gettodb(query, callback) {
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("crimenes"); //here
        findDateDb(query, dbase, callback)
    });
}

const findDateDb = async function(query, db, callback) {
    const collection = db.collection('crimen');
    collection.aggregate(query).toArray(function(err, docs) {
        callback(docs)
    });
}

exports.crimeOrtrafic = function(req, res) {
    getcrimeOrtrafic((documentos) => {
        res.send(documentos);
    })
}


function getcrimeOrtrafic(callback) {
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("crimenes"); //here
        findDatacrimeOrtrafic(dbase, callback)
    });
}

const findDatacrimeOrtrafic = function(db, callback) {
    const collection = db.collection('crimen');
    collection.find({ "IS_TRAFFIC": "1" }).count(function(e, count) {
        var IS_TRAFFIC = count;
        collection.find({ "IS_CRIME": "1" }).count(function(e, count) {
            callback([{ "IS_TRAFFIC": IS_TRAFFIC, "IS_CRIME": count }])
        });
    });
}
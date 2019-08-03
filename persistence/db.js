var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const path = require('path');

const PrecioGasolina = path.join(__dirname, '../data/final.csv');
const csv = require('csvtojson')

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

exports.numVechicle = function(req, res) {
    gettodb([{
            $group: { _id: "$numCars", total: { $sum: 1 } }
        },
        {
            $sort: { total: -1 }
        }, {
            $limit: 10
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

exports.PoliceReport = function(req, res) {
    gettodb([{
            $group: { _id: "$Police_Report", total: { $sum: 1 } }
        },
        {
            $sort: { total: -1 }
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

exports.month = function(req, res) {
    gettodb([{
            $group: { _id: { $month: { $convert: { input: "$Date_ocurre", to: "date" } } }, total: { $sum: 1 } }
        },
        {
            $sort: { _id: 1 }
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

exports.countyName = function(req, res) {
    gettodb([{
            $group: { _id: "$County_Name", total: { $sum: 1 } }
        },
        {
            $sort: { total: -1 }
        },
        {
            $limit: 10
        }
    ], (documentos) => {
        res.send(documentos);
    })
}

function gettodb(query, callback) {
    mongoClient.connect(url, function(err, db) { //here db is the client obj
        if (err) throw err;
        var dbase = db.db("accidentes"); //here
        findDateDb(query, dbase, callback)
    });
}

const findDateDb = async function(query, db, callback) {
    const collection = db.collection('accidente');
    collection.aggregate(query).toArray(function(err, docs) {
        callback(docs)
    });
}
var news = require('../services/news')
var body_parser = require('body-parser');
var db = require('../persistence/db');
exports.assignRoutes = function(app) {
    app.use(body_parser.urlencoded({ extended: true }));
    //Insertar datos
    // db.connectDB();

    app.get('/dayWeek', db.dayWeek);
    app.get('/ofensive', db.ofensive);
    app.get('/crimeOrTrafic', db.crimeOrtrafic);
    app.get('/district', db.district);
    app.get('/year', db.year);
}
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');

//var db = require('./models');

var PORT = process.env.PORT || 3000;

var app = express();

var router = express.Router();

require("./config/routes")(router);

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var mongodb = mongoose.connection;

mongodb.once('open', function(){
  console.log('connected to MongoDB');
});

mongodb.on('error', function(err){
 console.log(err);
});

app.set('views', path.join(__dirname, '/views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(router);

app.listen(PORT, function() {
  console.log("App running on http://localhost:3000 ");
});
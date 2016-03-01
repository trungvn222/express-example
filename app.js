
/**
 * Module dependencies.
 */
var express    = require('express'),
http           = require('http'), 
path           = require('path'),
config         = require('./config')(),
app            = express(),
swig           = require("swig"),
MongoClient    = require('mongodb').MongoClient,
favicon        = require("serve-favicon"),
bodyParser     = require("body-parser"),
methodOverride = require("method-override"),
cookieParser   = require("cookie-parser"),
session        = require("express-session"),
errorHandler   = require('errorhandler'),
logger = require('express-logger'),
MongoStore = require('connect-mongo')(session);

/**
 *	Setup
 */
var mongodbSession = require("./models/SessionModel");
var sessionOptions = {
	secret : "fastdelivery",
	saveUninitialized: true,
	resave: false,
	cookie: { secure: true },
	Store : new MongoStore({ mongooseConnection: mongodbSession.conn })
};

/**
 *	Controller
 */
var Admin = require('./controllers/Admin');

app.engine('html', swig.renderFile);
app.set('views', __dirname + '/templates');
app.set('view engine', 'html');
app.use(favicon( __dirname + "/public/images/favicon.ico" ));
app.use(logger({ path : "./logFile.txt" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser('fast-delivery-site'));
app.use(session(sessionOptions));
app.use('/images', express.static( path.join(__dirname + '/public/uploads') ));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  	app.use(errorHandler());
}

/**
 * Admin Router
 */

app.use('/admin', function(req, res, next) {
	Admin.run(req, res, next);
});
app.all('/admin/:action', function(req, res, next) {
	Admin.run(req, res, next);
});
app.all('/admin/:action/:id', function(req, res, next) {
	
	Admin.run(req, res, next);
});

http.createServer(app).listen(config.port, function() {
  	console.log("Connecting");
});





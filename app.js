
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'), 
	path = require('path'),
	config = require('./config')(),
	app = express(),
	swig = require("swig"),
	MongoClient = require('mongodb').MongoClient,
	Admin = require('./controllers/Admin'),
	//Home = require('./controllers/Home'),
	//Blog = require('./controllers/Blog'),
	//Page = require('./controllers/Page'),
	mongoose = require('mongoose');

//var model = require("./models/ContentModel");

// all environments
// app.set('port', process.env.PORT || 3000);
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/templates');
app.set('view engine', 'html');
app.use(express.favicon( __dirname + "/public/images/favicon.ico" ));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('fast-delivery-site'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use('/images', express.static( path.join(__dirname + '/public/uploads') ));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
}

app.all('/admin', function(req, res, next) {
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





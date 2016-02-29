var mongoose = require("mongoose");
var config = require('../config')();
module.exports = function() {
};
module.exports.prototype = {
	fields : {
	},
	db : "",
	conn : {},
	model : {},
	init : function(){
		if( this.db !== "" ){
			this.conn = mongoose.connect('mongodb://' + config.mongo.host + "/" + this.db).connection;
			var Schema = new mongoose.Schema(this.fields);
			this.model = mongoose.model( this.db, Schema );
		}
	},
	extend: function(properties) {
		var Child = module.exports;
		Child.prototype = module.exports.prototype;
		for(var key in properties) {
			Child.prototype[key] = properties[key];
		}
		return Child;
	},
	setDB: function(db) {
		this.db = db;
	},
	insert: function(data, callback) {
		this.model.create(data, callback || function( err, data ){});
	},
	save: function(data,callback){
		this.update( { _id : data._id }, callback || function(err, raw){}, data );
	},
	/*
		projection : select fields that will return
	*/
	find: function(conditions, callback, projection, option){
		this.model.find( conditions || {}, projection || { }, option || {}, callback || function(err, docs){} );
	},
	update: function(condition, callback, data){
		this.model.update(condition, {$set: data}, {}, callback || function(err, raw){} );
	},
	remove: function( condition, callback ){
		this.model.remove(condition, callback);
	}
}
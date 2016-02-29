var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = require("../models/AdminModel"),
	crypto = require("crypto"),
	urlOb = require("url"),
	File = require("../helper/file");

module.exports = BaseController.extend({ 
	name: "Admin",
	username: "admin",
	password: "admin",
	run: function(req, res, next) {
		var self = this;
		var action = req.params.action || "admin";
		if(this.authorize(req)){
			switch( action ){
				case "admin":
					this.index(req, res, next);
					break;
				case "add":
					this.add(req, res, next);
					break;
				case "edit":
					this.edit(req, res, next);
					break;
			}
		}else{
			var v = new View(res, "admin-login");
			v.render({
				title : "Login Page"
			});
		}
			
	},
	authorize: function(req) {
		if( req.session.fastdelivery ){
			return true;
		}else{
			if( req.body.username === this.username && req.body.password === this.password ){
				req.session.fastdelivery = true;
			}
		}
		return req.session.fastdelivery;
	},
	list: function(callback) {
		model.find(function(err, records) {
			callback(records);
		});
	},
	index: function(req, res, callback){
		var v = new View(res, "admin");
		this.list(function(records){
			v.render({
				title : "Index",
				content : 'Welcome to the control panel',
				list : records
			});
		});
	},
	edit: function(req, res, callback){
		var v = new View(res, "admin-edit");
		var id = req.params.id || "";
		if( req.body.action == "add" ){

		}else if( req.body.action == "edit" ){
			var data = {
				_id : req.body.id,
				title : req.body.title,
				type : req.body.type,
				picture : req.body.currentPicture,
				text : req.body.text
			};
			var picture = {};
			if(req.files.picture){
				data.picture = this.handleFileUpload(req);
			}
			
			model.save( data );
		}
		
		model.find( { _id : id }, function(err, doc){
			if( err ){
				console.log("page not found");
			}else{
				v.render(doc[0]);
			}
		});
	},
	add: function( req, res, callback){
		if( req.body.action == "add" ){
			var data = {
				title : req.body.title || "",
				type : req.body.type || "",
				picture : this.handleFileUpload(req),
				text : req.body.text
			}
			model.insert(data, function( err, data ){
				res.redirect('http://localhost:3000/admin/edit/' + data._id);
			});
		}else{
			var v = new View(res, "admin-add");
			v.render({
				title : "Add Mockup",
				content : "Add Mockup"
			});
		}
		
		
	},
	save: function( data, callback ){
		model.save(data,callback);
	},
	form: function(req, res, callback) {
		var returnTheForm = function() {
			if(req.query && req.query.action === "edit" && req.query.id) {
				model.getlist(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('admin-record', {
							ID: record.ID,
							text: record.text,
							title: record.title,
							type: '<option value="' + record.type + '">' + record.type + '</option>',
							picture: record.picture,
							pictureTag: record.picture != '' ? '<img class="list-picture" src="' + record.picture + '" />' : ''
						}, function(err, html) {
							callback(html);
						});
					} else {
						res.render('admin-record', {}, function(err, html) {
							callback(html);
						});
					}
				}, {ID: req.query.id});
			} else {
				res.render('admin-record', {}, function(err, html) {
					callback(html);
				});
			}
		}
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				title: req.body.title,
				text: req.body.text,
				type: req.body.type,
				picture: this.handleFileUpload(req),
				ID: req.body.ID
			}
			model[req.body.ID != '' ? 'update' : 'insert'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			model.remove(req.query.id, callback);
		} else {
			callback();
		}
	},
	handleFileUpload: function(req) {
		if(!req.files || !req.files.picture || !req.files.picture.name) {
			return req.body.currentPicture || '';
		}
		var uploadFile = new File(__dirname + "/../public/uploads/");
		var file = uploadFile.upload( req.files.picture );
		if( file ){
			return "images/" + file.name;
		}
		return "";
	}
});
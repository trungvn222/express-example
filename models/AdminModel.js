var Model = require("./Base"),
	model = new Model();
var AdminModel = model.extend({
	fields : {
		title: String,
		text: String,
		type: String,
		picture: String,
	},
	db : "admin"
});

var AdminModelObject = new AdminModel();
AdminModelObject.init();
module.exports = AdminModelObject;
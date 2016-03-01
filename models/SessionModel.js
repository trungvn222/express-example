var Model = require("./Base"),
	model = new Model();
var SessionModel = model.extend({
	fields : {
		title: String,
		text: String,
		type: String,
		picture: String,
	},
	db : "Session"
});

var SessionModelObject = new SessionModel();
SessionModelObject.init();

module.exports = SessionModelObject;
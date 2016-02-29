var Model = require("./Base"),
	model = new Model();
var ContentModel = model.extend({
	fields : {
		title: String,
		text: String,
		type: String,
		picture: String,
	},
	db : "test"
});

var ContentModelObject = new ContentModel();
ContentModelObject.init();

module.exports = ContentModelObject;
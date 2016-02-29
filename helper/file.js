var fs = require("fs"),
path = require("path");

module.exports = function( dest ){
	this.dest = dest;
};
module.exports.prototype = {
	extAllows : [ "jpg", "png", "gif", "jpeg", "html" ],
	checkExt : function( ext ){
		return this.extAllows.indexOf(ext) > -1
	},
	upload : function( file ){
		var extname = path.extname( file.name ),
		basename = path.basename( file.name, extname );

		if( this.checkExt( extname.replace(".","") ) ){
			var pathFile = this.dest + basename + extname,
			number = 1 ;

			while( fs.existsSync( pathFile ) ){
				number++;
				basename =  basename + "-" + number + extname;
				pathFile = this.dest + basename;
			}

			fs.createReadStream( file.path ).pipe(fs.createWriteStream( pathFile ));
			
			return {
				"min-type" : file.type,
				"name" : basename,
				"path" : path.resolve( pathFile )
			};
		}
		return 0;
	}
}
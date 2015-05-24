var redirect = require('./src/redirect');

module.exports = function(options){
	return function(req, res, next) {
		redirect.init(options);
		if(redirect.pathIsCorrect(req)) {
			next();
		} else {
			redirect.doRedirect(req, res);	
		}
	}
}
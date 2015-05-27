var localise = require('./localise');

var redirect = (function(){

	var countryUpper;
	var languageUpper;
	var separator;
	var reverse;
	var countryCookie;
	var langCookie;

	var twoCharRegex = new RegExp(/[a-z]{2}/);
	var localeRegex;

	function init(options) {
		countryUpper = options.countryUpper || false;
		languageUpper = options.languageUpper || false;
		separator = options.separator || '/';
		reverse = options.reverse || false;
		countryCookie = options.countryCookie || 'country_iso';
		langCookie = options.langCookie || 'lang_iso';

		localeRegex = new RegExp('^\\/' + twoCharRegex.source + (separator+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&") + twoCharRegex.source + "(\\/|\\?|$)", 'i');
	}

	function pathIsCorrect(req) {
		return req.originalUrl.match(localeRegex) !== null;
	}

	function doRedirect(req, res) {
		var country = localise.getCountry(req, countryCookie);
		var language = localise.getLanguage(req, langCookie, country);

		var urlPrefix = '/';
		if(reverse) {
			urlPrefix += languageUpper ? language.toUpperCase() : language;
			urlPrefix += separator;
			urlPrefix += countryUpper ? country.toUpperCase() : country;
		} else {
			urlPrefix += countryUpper ? country.toUpperCase() : country;
			urlPrefix += separator;
			urlPrefix += languageUpper ? language.toUpperCase() : language;	
		}
	    res.redirect(302, urlPrefix + req.originalUrl);
	}

	return {
		init: init,
		pathIsCorrect: pathIsCorrect,
		doRedirect: doRedirect
	};
});

module.exports = redirect();

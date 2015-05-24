var locale = require('locale');

var countryCookieRegex = new RegExp('^([a-zA-Z]{2})$');
var geoHeaderRegex = new RegExp('^(COUNTRIES:)([a-zA-Z]{2})$');
var langCookieRegex = new RegExp('^([a-zA-Z]{2})$');

var supportedLang = ['en','de','fr','zh'];
var supported = new locale.Locales(supportedLang);
var defaultLocales = {
    'fr' : 'fr',
    'de' : 'de',
    'cn' : 'zh'
};

var localise = {

    /*
		sets the user country
		1. country_iso cookie value, if present
		2. 'GEO' HTTP header, if present (example value of this header "COUNTRIES:US")
		3. Default to gb
		@req : the express request object
	*/
    getCountry: function(req) {
        var cookie_id = req.cookies.country_iso;

        if (typeof cookie_id !== 'undefined' && countryCookieRegex.test(cookie_id) === true) {
            return cookie_id.toLowerCase();
        }

        var geoHeader = req.headers.geo;

        if (typeof geoHeader !== 'undefined' && geoHeaderRegex.test(geoHeader) === true) {
            return geoHeader.substring(geoHeader.indexOf(':') + 1, geoHeader.length).toLowerCase();
        }

        return 'gb';
    },

    /*
		sets the user language
		1. lang_iso cookie value, if present
		2. First supported language found in Accept-Language HTTP header, if present
		3. Default language for country (fr=fr, de=de, cn=zh)
		4. Default to en
		@req : the express request object
	*/
    getLanguage: function(req, country) {

        var lang_iso = req.cookies.lang_iso;

        if (typeof lang_iso !== 'undefined' && langCookieRegex.test(lang_iso) === true) {
            return lang_iso.toLowerCase();
        }
        if (typeof req.headers['accept-language'] !== 'undefined') {

            var acceptLanguage = req.headers['accept-language'];
            var locales = new locale.Locales(acceptLanguage);
            var bestSupported = locales.best(supported);
            var bestSupportedLang = ' ';
            var firstFound = acceptLanguage.substring(0, 2);

            // the following loop makes sure we don't end up in the case where the the user has the following setup
            // 1. two unsupported languages in the browser
            // 2. the node locale library returns en as the bestSupported language even though it is not in the headers
            //	based on the process.env.LANG
            //
            //	eg { language: 'xz', score: 1 }
            //     { language: 'el', score: 0.5 }
            //		bestSupported : en

            for (var key in locales) {
                if (!locales.hasOwnProperty(key)) {
                  continue;
                }

                var languageObject = locales[key];
                if (bestSupported.language === languageObject.language) {
                    bestSupportedLang = bestSupported.language;
                }
            }

            // default to  (fr=fr, de=de, cn=zh) if it is language that we do not support and en is not in the
            // requested headers
            if (firstFound !== 'en' && country in defaultLocales && bestSupportedLang === ' ') {
                return defaultLocales[country];
            } else {
                return bestSupported.language;
            }

        }

        //if no headers at atll, then if country in default locales use that or else defautl to en
        if (defaultLocales[country]) {
            return defaultLocales[country];
        } else {
            return 'en';
        }
    }
};

module.exports = {
    makeUrl: localise.makeUrl,
    getCountry:localise.getCountry,
    getLanguage:localise.getLanguage
};
var localiseUrl = require('./localise-url');

module.exports = function(req, res) {
    var localisedPrefix = localiseUrl.makeUrl(req);
    var localisedUrl = localisedPrefix + req.originalUrl;
    res.redirect(302, localisedUrl);
};

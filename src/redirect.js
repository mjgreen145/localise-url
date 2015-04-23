var localiseUrl = require('./localise');

module.exports = function(req, res) {
    var localisedPrefix = localiseUrl.makeUrl(req);
    var localisedUrl = localisedPrefix + req.originalUrl;
    res.redirect(302, localisedUrl);
};

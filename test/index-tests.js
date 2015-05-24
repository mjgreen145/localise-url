var assert = require('chai').assert;
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');

var localiseUrl = require('../index');

describe('Localise Url - Index: Non-localised URL', function() {

    var req;
    var res;

    beforeEach(function(){
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();

        req.originalUrl = '/unlocalised/url';
    });

    it('Initialising returns a function', function() {
        assert.isFunction(localiseUrl({}));
    });

    it('Redirects for an unlocalised URL', function() {
        sinon.stub(res, 'redirect');

        var localiseMiddleware = localiseUrl({});
        localiseMiddleware(req, res);

        assert.isTrue(res.redirect.calledOnce);
        assert.isTrue(res.redirect.calledWith(302, '/gb/en/unlocalised/url'));
    });

});

describe('Localise Url - Index: Non-localised URL', function() {

    var req;
    var res;

    beforeEach(function(){
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();

        req.originalUrl = '/gb-en/localised/url';
    });

    it('Calls the next middleware for a localised url', function(done) {
        var localiseMiddleware = localiseUrl({
            separator: '-'
        });

        localiseMiddleware(req, res, function() {
            done();
        });
    });

});
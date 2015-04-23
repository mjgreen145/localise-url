var assert = require('chai').assert;
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');

var redirect = require('../src/redirect');

describe('Redirect', function() {

    var req, res;

    beforeEach(function(done) {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        done();
    });

    it('Localises a URL', function(done) {
        sinon.stub(res, 'redirect');
        req.originalUrl = '/unlocalised/path';

        redirect(req, res);

        assert.isTrue(res.redirect.calledOnce);
        assert.isTrue(res.redirect.calledWith(302, '/gb/en/unlocalised/path'));

        res.redirect.restore();
        done();
    });

    it('Preserves a query string', function(done) {
        sinon.stub(res, 'redirect');
        req.originalUrl = '/unlocalised/path?a=b&c=d';

        redirect(req, res);

        assert.isTrue(res.redirect.calledOnce);
        assert.isTrue(res.redirect.calledWith(302, '/gb/en/unlocalised/path?a=b&c=d'));

        res.redirect.restore();
        done();
    });

});

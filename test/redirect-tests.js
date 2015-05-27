var assert = require('chai').assert;
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');

var redirect = require('../src/redirect');

describe('Redirects', function() {

    var req, res;

    function testRedirect(originalUrl, expected, options) {
        sinon.stub(res, 'redirect');
        req.originalUrl = originalUrl;

        redirect.init(options);
        redirect.doRedirect(req, res);

        assert.isTrue(res.redirect.calledOnce);
        assert.isTrue(res.redirect.calledWith(302, expected));

        res.redirect.restore();
    }

    beforeEach(function() {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    it('Default Usage', function() {
        testRedirect('/unlocalised/path', '/gb/en/unlocalised/path', {});
    });

    it('Preserves a query string', function() {
        testRedirect('/unlocalised/path?a=b&c=d', '/gb/en/unlocalised/path?a=b&c=d', {});
    });

    it('Uppercase Country', function() {
        testRedirect('/unlocalised/path', '/GB/en/unlocalised/path', {
            countryUpper: true
        });
    });

    it('Uppercase Language', function() {
        testRedirect('/unlocalised/path', '/gb/EN/unlocalised/path', {
            languageUpper: true
        });
    });

    it('Uppercase both', function() {
        testRedirect('/unlocalised/path', '/GB/EN/unlocalised/path', {
            countryUpper: true,
            languageUpper: true
        });
    });

    it('Separator: hyphen', function() {
        testRedirect('/unlocalised/path', '/gb-en/unlocalised/path', {
            separator: '-'
        });
    });

    it('Reverse order', function() {
        testRedirect('/unlocalised/path', '/en/gb/unlocalised/path', {
            reverse: true
        });
    });

    it('custom country cookie name', function() {
        req.cookies.my_country = 'BR';
        testRedirect('/unlocalised/path', '/br/en/unlocalised/path', {
            countryCookie: 'my_country'
        });
    });

    it('custom language cookie name', function() {
        req.cookies.my_lang = 'ZH';
        testRedirect('/unlocalised/path', '/gb/zh/unlocalised/path', {
            langCookie: 'my_lang'
        });
    });

    it('Mixture of options', function() {
        req.cookies.my_country = 'TV';
        testRedirect('/unlocalised/path', '/en-TV/unlocalised/path', {
            reverse: true,
            separator: '-',
            countryUpper: true,
            languageUpper: false,
            countryCookie: 'my_country'
        });
    });
});

describe('Redirects - pathIsCorrect', function() {

    var req, res;

    function testPathIsCorrect(originalUrl, expected, options) {
        req.originalUrl = originalUrl;

        redirect.init(options);
        
        assert.equal(redirect.pathIsCorrect(req), expected);
    }

    beforeEach(function() {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    it('Default Usage - normal path', function() {
        testPathIsCorrect('/unlocalised/path', false, {});
    });

    it('Default Usage - root path', function() {
        testPathIsCorrect('/', false, {});
    });

    it('Default Usage - just locale', function() {
        testPathIsCorrect('/gb/en', true, {});
    });

    it('Default Usage - just locale with extra slash', function() {
        testPathIsCorrect('/gb/en/', true, {});
    });

    it('Default Usage - just locale with query string', function() {
        testPathIsCorrect('/gb/en?a=b', true, {});
    });

    it('With a query string', function() {
        testPathIsCorrect('/unlocalised/path?a=b&c=d', false, {});
    });

    it('Defaul, correct path', function() {
        testPathIsCorrect('/gb/en/unlocalised/path', true, {});
    });

    it('Uppercase Country, bad path', function() {
        testPathIsCorrect('/unlocalised/path', false, {
            countryUpper: true
        });
    });

    it('Uppercase Country, lowercase path', function() {
        testPathIsCorrect('/gb/en/unlocalised/path', true, {
            countryUpper: true
        });
    });

    it('Uppercase Country, uppercase path', function() {
        testPathIsCorrect('/GB/en/unlocalised/path', true, {
            countryUpper: true
        });
    });

    it('Uppercase Language - bad path', function() {
        testPathIsCorrect('/unlocalised/path', false, {
            languageUpper: true
        });
    });

    it('Uppercase Language - lowercase path', function() {
        testPathIsCorrect('/gb/en/unlocalised/path', true, {
            languageUpper: true
        });
    });

    it('Uppercase Language - uppercase path', function() {
        testPathIsCorrect('/gb/EN/unlocalised/path', true, {
            languageUpper: true
        });
    });

    it('Uppercase both - lowercase path', function() {
        testPathIsCorrect('/gb/en/unlocalised/path', true, {
            countryUpper: true,
            languageUpper: true
        });
    });

    it('Uppercase both - uppercase path', function() {
        testPathIsCorrect('/GB/EN/unlocalised/path', true, {
            countryUpper: true,
            languageUpper: true
        });
    });

    it('Separator: hyphen, slash in path', function() {
        testPathIsCorrect('/gb/en/unlocalised/path', false, {
            separator: '-'
        });
    });

    it('Separator: hyphen, good path', function() {
        testPathIsCorrect('/gb-en/unlocalised/path', true, {
            separator: '-'
        });
    });

    it('Mixture of options', function() {
        testPathIsCorrect('/en-GB/unlocalised/path', true, {
            reverse: true,
            separator: '-',
            countryUpper: true,
            languageUpper: false
        });
    });
});


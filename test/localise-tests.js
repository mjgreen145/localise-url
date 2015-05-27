var assert = require('chai').assert;
var httpMocks = require('node-mocks-http');

var cookieLocalisation = require('../src/localise');

describe('Localisation, getCountry', function() {

    var req;

    beforeEach(function(){
        req = httpMocks.createRequest();
    });

    it('Should use country_iso cookie if present, uppercase', function() {
        req.cookies.country_iso = 'US';
        req.headers.geo = 'COUNTRIES:GB';
        assert.strictEqual(cookieLocalisation.getCountry(req, 'country_iso'), 'us');
    });

    it('Should use country_iso cookie if present, lowercase', function() {
        req.cookies.country_iso = 'br';
        req.headers.geo = 'COUNTRIES:GB';
        assert.strictEqual(cookieLocalisation.getCountry(req, 'country_iso'), 'br');
    });

    it('Should use custom cookie name to find country', function() {
        req.cookies.my_country = 'br';
        req.headers.geo = 'COUNTRIES:GB';
        assert.strictEqual(cookieLocalisation.getCountry(req, 'my_country'), 'br');
    });

    it('Should use use GEO header if there is no cookie, uppercase', function() {
        req.headers.geo = 'COUNTRIES:FR';
        assert.strictEqual(cookieLocalisation.getCountry(req, 'country_iso'), 'fr');
    });

    it('Should use use GEO header if there is no cookie, lowercase', function() {
        req.headers.geo = 'COUNTRIES:cn';
        assert.strictEqual(cookieLocalisation.getCountry(req, 'country_iso'), 'cn');
    });

    it('Should default to GB', function() {
        assert.strictEqual(cookieLocalisation.getCountry(req, 'country_iso'), 'gb');
    });

});

describe('Localisation, getLanguage', function() {

    var req;

    beforeEach(function(){
        req = httpMocks.createRequest();
    });

    it('Should use lang_iso cookie if present, uppercase', function() {
        req.cookies.lang_iso = 'fr';
        req.headers['accept-language'] = 'en-GB,en;q=0.8,en-US;q=0.6,de;q=0.4,fr;q=0.2,es;q=0.2';
        assert.strictEqual(cookieLocalisation.getLanguage(req, 'lang_iso', 'gb'), 'fr');
    });

    it('Should use lang_iso cookie if present, lowercase', function() {
        req.cookies.lang_iso = 'ZH';
        req.headers['accept-language'] = 'en-GB,en;q=0.8,en-US;q=0.6,de;q=0.4,fr;q=0.2,es;q=0.2';
        assert.strictEqual(cookieLocalisation.getLanguage(req, 'lang_iso', 'gb'), 'zh');
    });

    it('Should use a custom cookie name to find language', function() {
        req.cookies.my_lang = 'ZH';
        req.headers['accept-language'] = 'en-GB,en;q=0.8,en-US;q=0.6,de;q=0.4,fr;q=0.2,es;q=0.2';
        assert.strictEqual(cookieLocalisation.getLanguage(req, 'my_lang', 'gb'), 'zh');
    });

    it('Should use use accept-language header if there is no cookie, uppercase', function() {
        req.headers['accept-language'] = 'fr-FR,fr;q=0.8,en-US;q=0.6,de;q=0.4,fr;q=0.2,es;q=0.2';
        assert.strictEqual(cookieLocalisation.getLanguage(req, 'lang_iso', 'gb'), 'fr');
    });

    it('Should use the country default if available', function() {
        req.headers.geo = 'COUNTRIES:cn';
        assert.strictEqual(cookieLocalisation.getLanguage(req, 'lang_iso', 'cn'), 'zh');
    });

    it('Should default to en', function() {
        assert.strictEqual(cookieLocalisation.getLanguage(req, 'lang_iso', 'gb'), 'en');
    });

});

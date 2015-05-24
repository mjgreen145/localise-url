# localise-url [![Build Status: Linux](https://travis-ci.org/mjgreen145/localise-url.svg?branch=master)](https://travis-ci.org/mjgreen145/localise-url)
>Express middleware for localising your URLs based on user's location and language preferences.

Easily redirect unlocalised URLs to localised ones, for example:

`www.site.com/path` 

becomes

`www.site.com/gb/en/path`

Getting started
---------------
Install this modue with the following command:
```shell
npm install --save localise-url
```

Usage
--------
This module is used as middleware for Express. 
It requires  the [express cookie-parser](https://github.com/expressjs/cookie-parser) middleware to be executed first for each request.

The module checks whether the requested URL is localised (based on the options you provide it), and just moves on to the next middleware if it is. If it isn't, it results in a 302 redirect to a localised URL.
This allows you to combine multiple types of path into one block of code:
```js
var localiseUrl = require('localise-url')(options);
app.get(['/path', '/:country/:lang/path'], 
        localiseUrl,
        //more middleware
);
```
Alternatively, they can be separated:
```js
var localiseUrl = require('localise-url')(options);
app.get('/path', 
        localiseUrl);
        
app.get('/:country/:lang/path', function() {
    // process request
});
```

Options
-------

#### separator
Type: `String`
Default: `'/'`

The country and language parts of the path will be joined using this string.

#### reverse
Type: `Boolean`
Default: `false`

Reverse the country and language parts of the URL, so that language comes first.

#### countryUpper
Type: `Boolean`
Default: `false`

Makes the country part of the URL uppercase when generated. This does not force the module to match an uppercase country in the URL when seeing if the URL is already localised.

#### languageUpper
Type: `Boolean`
Default: `false`

Makes the country part of the URL uppercase when generated. This does not force the module to match an uppercase language in the URL when seeing if the URL is already localised.


Determining Country
-------------------

The user's country is determined using the following rules:

1. The value of the 'country_iso' cookie, if it exists
2. The value of the 'GEO' HTTP header, which should take the form "COUNTRIES:US", for example.
3. Defaults to 'gb'

Determining Language
--------------------

The user's language is determined using the following rules:

1. The value of the 'lang_iso' cookie, if it exists
2. First supported language found in Accept-Language HTTP header, if present. Supported languages are `['en', 'de', 'fr', 'zh']`
3. Default language for the user's country (as determined above).
4. Default to 'en'

Copyright
---------
Copyright (c) 2015 Matthew Green. See LICENSE for details.

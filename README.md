[![GitHub issues](https://img.shields.io/github/issues/userpixel/micromustache.svg?style=flat-square)](https://github.com/userpixel/micromustache/issues)


# micromustache

![Logo](https://raw.github.com/userpixel/micromustache/master/logo.png)

This tool covers the most important use case: **interpolation: replacing variable names with their values from an object**.

![Figure 1](https://raw.github.com/userpixel/micromustache/master/fig-1.png)

If that's all you need, micromustache is a drop-in replacement for MustacheJS.

- [Features](#features)
- [Tradeoffs](#tradeoffs)
- [API](#api)
  - [render()](#micromustacherender)
    - [Differences with MustacheJS](#differences-with-mustachejs-render-method)
  - [compile()](#micromustachecompile)
- [Tests](#tests)
- [FAQ](#faq)
- [License](#license)

## Features

* No dependencies
* Works in node (CommonJS) and Browser (AMD, global, Browserify/WebPack)
* Well tested
* Dead simple to learn yet a pleasure to use
* Well documented with many examples
* Behave exactly like mustache.js for the supported functionalities

But wait, don't ES6 Template literals solve the same problem? Read FAQ at the end of this page.

## Tradeoffs

Micromustache achieves faster speed and smaller size by dropping the following
features from MustacheJS:

* Array iterations: *{{# ...}}*
* Partials: *{{> ...}}*
* Arrays as values: *{{ arrName[1] }}* (you can access arrays like `arrName.1` though)
* Inverted selection: *{{^ ...}}*
* Comments: *{{! ...}}*
* HTML sanitization: *{{{ propertyName }}}*
* Custom delimiters: *No support for <% ... %>. We just have {{ ... }}*
* It does no support IE 6-8

If you can live with this, read on...

# API

## micromustache.render()

Signature:

```js
/**
 * @param {string} template - the template containing one or
 *        more {{variableNames}}
 * @param {Object} [view={}] - an optional object containing values for
 *        every variable names that is used in the template. If it's omitted,
 *        it'll be assumed an empty object.
 * @param {GeneralValueFn} [generalValueFn] an optional function that will be
 *        called for every key to generate a value. If the result is undefined
 *        we'll proceed with the default value resolution algorithm.
 *        This function runs in the context of view.
 * @returns {string} template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON error the result will look like "{...}".
 */
micromustache.render(template, view, generalValueFn);
```

Renders a template with the provided key/values from the view object. Example:

````js
var person = {
  first: 'Michael',
  last: 'Jackson'
};
micromustache.render('Search {{first}} {{ last }} popcorn!', person);
//output = "Search Michael Jackson popcorn!"
````

You can even access array elements and `length` because they are all valid keys in the array object in javascript:

```js
var fruits = [ "orange", "apple", "lemon" ];
micromustache.render("I like {{0}}, {{1}} and {{2}} ({{length}} fruits!)", fruits);
//output = "I like orange, apple and lemon (3 fruits!)"
```

*Note: if a key is missing or null, it'll be treated as it contained a value
of empty string (i.e. the {{variableName}} will be removed from the template).*

You can easily reference deep object hierarchies:

```js
var singer = {
  first: 'Michael',
  last: 'Jackson',
  children: [
    {
      first: 'Paris-Michael',
      middle: 'Katherine',
    },
    {
      first: 'Prince',
      middle: 'Michael',
      prefix: 'II'
    },
    {
      first: 'Michael',
      middle: 'Joseph',
      prefix: 'Jr.'
    }
  ]
}
micromustache.render("{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, {{children.1.first}} and {{children.2.first}}", singer);
//output = "Michael Jackson had 3 children: Paris-Michael, Prince and Michael"
```

As you can see micromustache doesn't have loops or any other fancy feature that MustacheJS offers.

### Differences with MustacheJS render() method

micromustache is a bit more forgiving than MustacheJS. For example, if the `view` is `null` or
`undefined`, MustacheJS throws an exception but micromustache doesn't.


## micromustache.compile()

Function signature:

```js
/**
 * @param {string} template - same as the template parameter to .render()
 * @returns {function} a function that accepts a view object and returns a
 *        rendered template string
 */
micromustache.compile(template);
```

You can compile the template and get a function that can be used multiple times:

```js
var templateEngine = micromustache.compile('Search {{first}} {{ last }} popcorn!');
output = templateEngine(person);
//output = "Search Michael Jackson popcorn!"
output = templateEngine({first:'Albert',last:'Einstein'});
//output = "Search Albert Einstein popcorn!"
```

This function makes your code cleaner but for simplicity doesn't use any memoization
technique behind the scenes.

# Installation

There are 4 ways to get the library:

[npm](https://npmjs.org/package/micromustache):

```bash
npm install micromustache
```

[Bower](http://bower.io/):

````bash
bower install micromustache
````

[CDN](https://cdnjs.com/libraries/micromustache):

````HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/micromustache/3.0.4/micromustache.js"></script>
````

Download directly from [browser directory](https://github.com/userpixel/micromustache/tree/master/browser)

Clone this Git repo:

````bash
git clone https://github.com/userpixel/micromustache
````

# Tests

We use Mocha/Chai for tests:

```
npm test
```

The browser module loading tests (
[AMD](https://github.com/userpixel/micromustache/blob/master/test/amd.html)
and
[global](https://github.com/userpixel/micromustache/blob/master/test/global.html)
) need to be loaded in the browser.

# FAQ

**Q. What about [ES6 template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals)
(AKA "template strings")?
Aren't they gonna deprecate this library?**

A. The expressions in a string literal can't reference values from outside its scope.
Therefore it is not possible to simply pass an object and resolve variables from its keys.
The [tagged template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)
cover part of the functionality but they:

* are not Mustache-compatible
* require compilation for Android and IE

However, since when they are natively supported by the runtime, they have a
great performance and if you learn to use the native way of doing things,
you don't have to learn an ever-changing library, though their functionality is
more limited than MustacheJS.

# License

MIT

# TODO

* Add a command line version similar to
[mustache.js](https://github.com/janl/mustache.js/blob/master/bin/mustache).

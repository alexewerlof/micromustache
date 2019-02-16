[![Build Status](https://travis-ci.org/userpixel/micromustache.svg?branch=master)](https://travis-ci.org/userpixel/micromustache)
[![GitHub issues](https://img.shields.io/github/issues/userpixel/micromustache.svg)](https://github.com/userpixel/micromustache/issues)
[![Version](https://img.shields.io/npm/v/micromustache.svg?style=flat-square)](http://npm.im/micromustache)
[![Downloads](https://img.shields.io/npm/dm/micromustache.svg?style=flat-square)](http://npm-stat.com/charts.html?package=micromustache&from=2017-01-01)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT License](https://img.shields.io/npm/l/callifexists.svg?style=flat-square)](http://opensource.org/licenses/MIT)

# micromustache

![Logo](https://raw.github.com/userpixel/micromustache/master/logo.png)

A logicless template engine with some handy additions.
This small library covers the most important use case for [Mustache templates](https://mustache.github.io/):

**interpolation: replacing variable names with their values from an object.**

> Think of it as a sweet spot between plain text replacement and mustache (certainly not as logicful as [Handlebars](http://handlebarsjs.com/)).

If that's all you need, *micromustache* is a drop-in replacement for MustacheJS.

* No dependencies
* Secure. Works in CSP environments.
* No regular expression.
* Minimalist! No fancy features and enough rope to hang the developer
* 2x-3x faster than Mustache and consumes less memory
* Does not aggressively cache internal parsing results and does not introduce memory leaks
* The object accessor syntax is closer to JavaScript than Mustache
* The errors are more aligned with JavaScript than Mustache
* Works on string templates (and it actually improves its speed)
* [Fully compatible](test/mustache-compatiblity.spec.js) with MustacheJS for **interpolation**
* Works in node (CommonJS) and Browser (using CommonJS build tools like
  [Browserify](http://browserify.org/)/[WebPack](https://webpack.github.io/))
* Well tested (full test coverage over 80+ tests)
* Dead simple to learn yet a pleasure to use
* Behaves similar to JavaScript and avoids quirks from lodash and Mustache
* The code is small and easy to read and has full JSDoc documentation
* Custom delimiters: instead of `{{ ... }}` use `{ ... }`, `( ... )`, `<% ... %>` or anything you desire*
* Arrays as values: `{{ arrName[1] }}` (mustachejs does not support this)

## Tradeoffs

Micromustache achieves faster speed and smaller size by dropping the following
features from [MustacheJS](https://github.com/janl/mustache.js):

* Array iterations: *{{# ...}}*
* Partials: *{{> ...}}*
* Inverted selection: *{{^ ...}}*
* Comments: *{{! ...}}*
* HTML sanitization: *{{{ propertyName }}}*

If you can live with this, read on...

# API

## `render(template, view = {}, options)`


### Parameters
* `template: string`: The template containing one or more `{{variableNames}}`.
* `view: Object`: An optional object containing values for every variable names that is used in the
 template. If it's omitted, it'll be assumed an empty object.
* `options` see compiler options

### Return

The return is always the same type as the template itself (if template is not a string, it'll be
returned untouched and no processing is done). All `{{varName}}` strings inside the template will
be resolved with their corresponding value from the `view` object.
If a particular path doesn't exist in the `view` object, it'll be replaced with empty string (`''`).
Objects will be `JSON.stringified()` but if there was an error doing so (for example when there's
a loop in the object, they'll be simply replaced with `{...}`.

### Example:

```js
var person = {
  first: 'Michael',
  last: 'Jackson'
};
micromustache.render('Search for {{first}} {{ last }} songs!', person);
// output = "Search for Michael Jackson songs!"

// If a custom resolver was provided it would be called two times with these params:
// ('first', person)
// ('last', person) <-- notice the varName is trimmed
```

You can even access array elements and `length` because they are all valid keys in the array object
in javascript:

```js
var fruits = [ 'orange', 'apple', 'lemon' ];
micromustache.render('I like {{length}} fruits: {{0}}, {{1}} and {{2}}.', fruits);
// output = "I like 3 fruits: orange, apple and lemon."
// If a custom resolver was provided it would be called three times with these params:
// ('0', person) <-- notice that the array indices are sent as strings.
// ('1', person)
// ('2', person)
```

*Note: if a key is missing or `null`, it'll be treated as if it contained a value
of empty string (i.e. the {{variableName}} will be removed from the template).*

```js
var person = {
  first: 'Michael',
  last: 'Jackson'
};
micromustache.render('He was {{age}} years old!', person);
// output = "He was  years old!"
```

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

*As you can see unlike MustacheJS, micromustache doesn't have loops.*

### Differences with MustacheJS render() method

* micromustache is a bit more forgiving than MustacheJS. For example, if the `view` is `null` or
 `undefined`, MustacheJS throws an exception but micromustache doesn't. It just assumes an empty
 object for the view.
* also the `options` don't exist in MustacheJS but is a powerful little utility that halps
 some use cases.

## `compile(template, customResolver)`

This is a utility function that accepts a `template` and `customResolver` and returns a renderer
function that only accepts view and spits out filled template. This is useful when you find yourself
using the render function over and over again with the same template. Under the hood it's just a thin
layer on top of `render` so it uses the same parameters 👆.

### Return

A function that accepts a `view` object and returns a rendered template string.

### Example

```js
const templateEngine = micromustache.compile('Search {{first}} {{ last }} popcorn!');
var output = templateEngine(person);
// output = "Search Michael Jackson popcorn!"

output = templateEngine({first:'Albert',last:'Einstein'});
// output = "Search Albert Einstein popcorn!"
```

`compile()` doesn't do any memoization so it doesn't introduce any performance improvmenet to your
code.

# Command Line Interface

Micromustache comes with a simple CLI that brings the `render()` functionality to shell programming.

```bash
npm i -g micromustache
```
This will make the `micromustache` command available on your shell.
It works like this:

```bash
micromustache templatePath viewPath
```

Both parameters are required.
* `templatePath`: path to a template text file that contains {{varName}} in it
* `viewPath`: path to a valid json file

Files are read/write with utf8 encoding.
By default CLI prints the output to console (and erros to stderr).
You can redirect it to output file using `> outputPath`.

### Example:

```bash
micromustache template.txt view.json > output.txt
```

This command reads the contents of `template.txt` and `render()` it using data from `view.json`
and puts the result text in `output.txt`.

# Tests

We use Mocha/Chai for tests. If you want to run the tests, install dependencies and run them using
npm:

```
npm it
```

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
* need the variables to be accessible in the scope of the template literal

However, since when they are natively supported by the runtime, they have a
great performance and if you learn to use the native way of doing things,
you don't have to learn yet another library, though their functionality is
more limited than MustacheJS.

**Q. I want "INSERT SOME MUSTACHE FEATUE HERE" but it's not available in MicroMustache. Can I add it?**

A. Make an issue first. The goal of MicroMustache is to be super tiny and while adressing the most important use-case of Mustache. If there's something that is terribly missing, we may add it, otherwise, you may fork it and call it something else OR use MustacheJS.

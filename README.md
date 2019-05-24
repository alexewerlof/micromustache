[![Build Status](https://travis-ci.org/userpixel/micromustache.svg?branch=master)](https://travis-ci.org/userpixel/micromustache)
[![GitHub issues](https://img.shields.io/github/issues/userpixel/micromustache.svg)](https://github.com/userpixel/micromustache/issues)
[![Version](https://img.shields.io/npm/v/micromustache.svg?style=flat-square)](http://npm.im/micromustache)
[![Downloads](https://img.shields.io/npm/dm/micromustache.svg?style=flat-square)](http://npm-stat.com/charts.html?package=micromustache&from=2017-01-01)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT License](https://img.shields.io/npm/l/callifexists.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Known Vulnerabilities](https://snyk.io/test/github/userpixel/micromustache/badge.svg)](https://snyk.io/test/github/userpixel/micromustache)

# micromustache

![Logo](https://raw.github.com/userpixel/micromustache/master/logo.png)

A minimalist, fast and **secure** [Mustache](https://mustache.github.io/) template engine with some handy additions.

**Think of it as a sweet spot between plain text interpolation and [mustache.js](https://github.com/janl/mustache.js); Certainly not as logic-ful as [Handlebars](http://handlebarsjs.com/)! Sometimes a stricter syntax is the right boundary to limit complexity.**

If variable interpolation is all you need, *micromustache* is a drop-in replacement for MustacheJS.

* 🏃 **2x-3x** faster than MustacheJS
* 🔒 **Secure**. Works in CSP environments (no usage of `eval()` or `new Function()`). Published only with 2FA. No risk for [regexp DDoS](https://medium.com/@liran.tal/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02).
* 🎈 **Lightweight** No dependencies, less than 400 lines of code, small API surface, easy to pick up
* 🐁 **Smaller memory footprint.** sane caching, no memory leak
* 🏳 **No dependencies**
* 🤓 **Bracket notation** support `a[1]['foo']` accessors (mustache.js syntax of `a.1.foo` is still supported).
* 🚩 **Meaningful errors** in case of template syntax errors to make it easy to spot and fix
* ⚡ **TypeScript** types included and updated with every version of the library
* 🐇 Works in node (CommonJS) and Browser (using CommonJS build tools like [Browserify](http://browserify.org/) or [WebPack](https://webpack.github.io/))
* 🛠 Well tested (full test coverage over 120+ tests)
* 📖 Full JSDoc documentation

[Try it in your browser!](https://npm.runkit.com/micromustache)

## Tradeoffs

Micromustache achieves its faster speed and smaller size by dropping the following
features from [MustacheJS](https://github.com/janl/mustache.js):

* Array iterations: *{{# ...}}*
* Partials: *{{> ...}}*
* Inverted selection: *{{^ ...}}*
* Comments: *{{! ...}}*
* HTML sanitization: *{{{ propertyName }}}*

Otherwise it is so compatible with Mustache.js, it is a [drop-in replacement](src/mustachejs.spec.js) (for interpolation).

# Getting started

> render
> a use case that cannot be done with template literals (template not in scope)
> Not just mustache syntax, in fact not the weird mustache and handlebars syntax: `a["b"]`
> How about the errors?
> render with a resolver
> We have 'get'
> How about arrays? JSX?
> What if you use the same template again and again? First note that render doesn't cache anything
> compile spits out Renderer
> When the renderer is out of scope, the cache is freed
> Link to how it compares with other libs

# API

## `render(template, scope = {}, options)`

### Parameters
* `template: string`: The template containing one or more `{{variableNames}}`.
* `scope: Object`: An optional object containing values for every variable names that is used in the
 template. If it's omitted, it'll be assumed an empty object.
* `options` see compiler options

### Return

The return is always the same type as the template itself (if template is not a string, it'll be returned untouched and no processing is done). All `{{varName}}` strings inside the template will be resolved with their corresponding value from the `scope` object. If a particular varName doesn't exist in the `scope` object, it'll be replaced with empty string (`''`). Objects will be `JSON.stringified()` but if there was an error doing so (for example when there's a loop in the object, they'll be simply replaced with `{...}`.

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

You can even access array elements and `length` because they are all valid keys in the array object in javascript:

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
const singer = {
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

As you can see unlike MustacheJS, micromustache doesn't have loops but the work around is the same solution as when using string template literals:

```js
const scope = {...singer, children: singer.children.map(child => render('{{first}}', child).join(', '))}
micromustache.render("{{first}} {{last}} had {{children.length}} children: {{children}}", scope);
//output = "Michael Jackson had 3 children: Paris-Michael, Prince and Michael"
```

### Differences with MustacheJS render() method

* Micromustache is a bit more forgiving than MustacheJS. For example, if the `scope` is `undefined`, MustacheJS throws an exception but micromustache doesn't. It just assumes an empty object for the scope.
* also the `options` don't exist in MustacheJS but is a powerful little utility that helps some use cases.
* Mustache.js caches parsed results to improve performance. However if you parse many different strings, the memory usage goes up and corrodes your application. Micromustache also does some caching but uses a least-recently-used (LRU) cache to prevent too much memory consumption.

## `compile(template, customResolver)`

This is a utility function that accepts a `template` and `customResolver` and returns a renderer
function that only accepts scope and spits out filled template. This is useful when you find yourself
using the render function over and over again with the same template. Under the hood it's just a thin
layer on top of `render` so it uses the same parameters 👆.

### Return

A Renderer object that accepts a `scope` object and returns a rendered template string.

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
micromustache templatePath scopePath
```

Both parameters are required.
* `templatePath`: path to a template text file that contains {{varName}} in it
* `scopePath`: path to a valid json file

Files are read/write with utf8 encoding.
By default CLI prints the output to console (and erros to stderr).
You can redirect it to output file using `> outputPath`.

### Example:

```bash
micromustache template.txt scope.json > output.txt
```

This command reads the contents of `template.txt` and `render()` it using data from `scope.json`
and puts the result text in `output.txt`.

# Tests

We use Mocha/Chai for tests. If you want to run the tests, install dependencies and run them:

```bash
npm it
```

# Security

Micromustache has been built from the ground up with security in mind:

* It does not have any `dependency` which means there's zero change for malicious
packages to your runtime security at risk.
* The code is small. More code ~ more bugs and more places for bugs to hide and breed. The feature set and API surface is intentionally kept minimalistic to avoid complex logic. There's only enough code that needs to be.
* It's only published with 2 factor authentication by the main author and no third party
or automated deployment system is used.
* It does not use any regular expression which reduces the risk for [Regex DDos](https://medium.com/@liran.tal/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02)
* It does not use `new Function()` or `eval()` hence it can run in high security environments that enforce
Content Security Policy (CSP)
* All functions validate their parameter before execution. This not only prevents abuse but also improves the developer experience (DX) by throwing actionable error messages
* It does not aggressively cache all template parsing results and therefore will not leak memory silently
and crash your application or server. Once a `Renderer` is not referenced, all cache is freed.
Besides the `render()` function will never cache.
* I have no intention of selling it (koa-router sold: https://news.ycombinator.com/item?id=19156707)
* The code is open source and very well documented so it is easy to inspect how it works.

# Advanced usage

> use it to search all tags
> the Renderer render methods are bound and can be used with deconstructor syntax

# FAQ

**Q. I want loops**

Unlike MustacheJS or Handlebars, micromustache does not have a custom syntax for loops. Instead it encourages you to use JavaScript for that (pretty much how JSX avoids custom template syntax as opposed to Vue or Angular).

For example if you have an array of objects:

```javascript
const people = [
  { name: 'Alex', age: 37 },
  { name: 'Oskar', age: 35 },
  { name: 'Anna', age: 43 }
]

let template = people.reduce(
  t, ({name, age}) => t += `A person called {{name}} and is {{age}} years old`,
  'The people are:\n'
)
```

And then somewhere else in your code you can use that template like:

```javascript
```

**Q. How do you threat resolver functions?**

The `renderFn()` and `renderFnAsync()` get a function as their first parameter and run them for every variable name in the template. The function gets the variable name and the scope as arguments and is supposed to return the resolved value ready to be injected into the template string. If your function throws, `renderFn()/renderFnAsync()` throw as well.

**Q. Do you support multiple scopes and lookup fall back mechanisms?**

This can easily be done using JavaScript object-spread operator as seen in one of the [examples](./examples).

**Q. What about [ES6 template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) (AKA "template strings")? Aren't they gonna deprecate this library?**

A. ES6 native Template literals work great when you have the template in the same scope as the values. If you want to build the template somewhere else (for example for internationalization) it gets complicated.

However, when you want to decouple the interpolation (rendering) from the scope there's currently no way to do that natively. Example suppose you have a code that converts an `Error` to a string:

```javascript
const error = new Error('Just an example')
let message = `Error message: ${e.message}!`
```
But what if you don't have the error object in the scope?
You could use a function.

```javascript
const renderError = (e) => `Error message: ${e.message}!`
message = renderError(error)
```

But what if your want to use a different property of the error?

```javascript
const renderError = (e, propName) => `Error message: ${e[propName]}!`
message = renderError(error, 'stack')
```

You can see that this soon becomes complicated. With micromustache you can do this a bit easier:

```javascript
const { compile } = require('micromustache')
const renderError = compile('Error message: {{message}}')
message = renderError(error)
```

If you want to generate a template programmatically, you cannot use the Template literals but with micromustache, you just build a string.

Also this library allows you to refer to variables that are not in the scope and compile a template and will resolve those values lazily and/or at a different context.

**Q. I want "INSERT SOME MUSTACHE FEATURE HERE" but it's not available in MicroMustache. Can I add it?**

A. Make an issue first. The goal of MicroMustache is to be super tiny and while addressing the most important use-case of Mustache. If there's something that is terribly missing, we may add it, otherwise, you may fork it and call it something else OR use MustacheJS.

# Differences with Mustache

Mustache allows variables with empty names. All of these are valid in Mustache:

* `{{}}`
* `{{ }}`
* `{{   }}`

However Mustache accepts some other invalid parameters.
For example:

```javascript
mustache.render('{{a{{b}}', {
  a: 'foo',
  b: 'bar'
  'a{{b': 'wat?',
}) // gives "wat?"
```

# Known issues

For the sake of speed, code size and less complexity (which tends to attract bugs), some edge cases are not addressed:

**A varName cannot include the `']'` character**

For example if you have an object like:

```javascript
const a = {
  ']': 'close'
}
```

`a[']']` will not give `'close'` but rather throws a syntax error complaining that you have a mismatching quotation!

**It doesn't require string delimiters:**

Suppose you have this in Javascript:

```javascript
const a = {
  'foo': 'bar'
}
```

If you want to get the value of the `foo` property, in Javascript you can say `a['foo']`. This works in micromustache too but you can also say `a[foo]` which is not valid Javascript strictly speaking but works without error.

**No comments**

Unlike Mustache.js you cannot comment a variable name.

**No escape sequence**

The templates cannot currently contain `{{` and there's no way to escape it. One workaround is to literally pass `'{{'` as a value for a variable. Another workaround is to explicitly set the `tags` option to something other than `['{{', '}}']`, for example `['<', '>']`. 

**No nested variables**

Currently there is no way to use a nested variable name:

```javascript
const scope = {
  a: ['Java', 'Python', 'Ruby'],
  b: 1
}

micromustache.render(`My favorite language is not {{a[b]}}`)
```

Will not give `'Python'` because `a[b]` is treated as `a['b']` or `a.b`. In other words instead of `scope.a[scope.b]` it gives the value of `scope.a.b`.

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

**Think of it as a sweet spot between plain text interpolation and [mustache.js](https://github.com/janl/mustache.js); Certainly not as logic-ful as [Handlebars](http://handlebarsjs.com/)! Sometimes a stricter syntax is the right boundary to reduce potential errors and improve performance.**

* 🏃 **2x-3x** faster than MustacheJS
* 🔒 **Secure**. Works in CSP environments (no usage of `eval()` or `new Function()`). Published only with 2FA. No risk for [regexp DDoS](https://medium.com/@liran.tal/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02).
* 🎈 **Lightweight** No dependencies, less than 400 lines of source code, small API surface, easy to pick up
* 🐁 **Smaller memory footprint.** sane caching, no memory leak
* 🏳 **No dependencies**
* 🤓 **Bracket notation** support `a[1]['foo']` accessors (mustache.js syntax of `a.1.foo` is still supported).
* 🚩 **Meaningful errors** in case of template syntax errors to make it easy to spot and fix. All functions test their input contracts and throw meaningful errors to improve developer experience (DX)
* ⚡ **TypeScript** types included and updated with every version of the library
* 🐇 Works in node (CommonJS) and Browser (using CommonJS build tools like [Browserify](http://browserify.org/) or [WebPack](https://webpack.github.io/))
* 🛠 Well tested (full test coverage over 120+ tests)
* 📖 Full JSDoc documentation
* [CLI](./bin/README.md) for quickly doing interpolations without having to write a program

<a href="https://opencollective.com/micromustache" target="_blank">
  <img src="https://opencollective.com/micromustache/donate/button@2x.png?color=blue" width=300 />
</a>

[Try it in your browser!](https://npm.runkit.com/micromustache)

## Tradeoffs

Micromustache achieves its faster speed and smaller size by dropping the following features from [MustacheJS](https://github.com/janl/mustache.js):

* Array iterations: `{{# ...}}` (you can still pass the result in a variable)
* Partials: `{{> ...}}`
* Inverted selection: `{{^ ...}}`
* Comments: `{{! ...}}`
* HTML sanitization: `{{{ propertyName }}}`
* [See all the differences with MustacheJS](https://github.com/userpixel/micromustache/wiki/Differences-with-Mustache)

If variable interpolation is all you need, *micromustache* is a [drop-in replacement](src/mustachejs.spec.js) for MustacheJS.

# Getting started

Install:

```bash
$ npm i micromustache
```

Use:

```javascript
const { render } = require('micromustache')
console.log(render('Hello {{name}}!', { name: 'world' }))
// Hello world!
```

So what's the point? Why not just use EcmaScript [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)?

Template literals work great when the template and the variables are in the same scope. For example, suppose you have a function like this:

```javascript
function greet(name) {
  return `Hi ${name}!`
}
```

After your function became successful and you get rich, you may decide to dominate the world and expand to new markets which speak other languages. You need to internationalize it. Adding one more language is easy:

```javascript
function greet(name, lang) {
  return lang === 'sv' ? `Hej ${name}!` : `Hi ${name}!`
}
```

But how about a bunch of them?

```javascript
function greet(name, lang) {
  switch (lang) {
    case 'sv': return `Hej ${name}!`
    case 'es': return `Hola ${name}!`
    default:
    case 'en': return `Hi ${name}!`
  }
}
```

You get the picture, that doesn't scale well! The main problem is that the content (the text) is coupled to the function (the variable interpolation). Template engines help you to move the content out of the function and let something else deal with that concern.

```javascript
const { render } = require('micromustache')
// A very simplified i18n database
const db = {
  en: {
    greeting: 'Hi {{name}}!',
    // ...
  },
  sv: {
    greeting: 'Hej {{name}}!',
    // ...
  },
  // ...
}

function greet(name, lang) {
  return render(db[lang].greeting, { name } )
}
```

Just like template literals, you can of course reference deep nested objects:

```javascript
const { render } = require('micromustache')
const scope = {
  fruits: [{
    name: 'Apple', color: 'red',
    name: 'Banana', color: 'yellow',
  }]
}
console.log(render('I like {{fruits[1].color}}!', scope))
// I like Bababa!
```

*It worth to note that Mustache and Handlebars don't support `fruits[1].color` syntax and rather expect you to write it as `fruits.1.color`.*

The real power of micromustache comes from letting you resolve a variable name to something you choose. To pass a resolver function, you can use `renderFn()` instead of `render()`:

```javascript
const { renderFn } = require('micromustache')
const up = str => str.toUpperCase()

console.log(renderFn('My name is {{Alex}}!', up))
// My name is ALEX!
```

If you want to lookup a key in an object, there's a `get()` function as well:

```javascript
const { renderFn, get } = require('micromustache')

function star(str, scope) {
  // str is 'password'
  // scope is { password: 'abc' }
  const value = get(scope, str) // value is 'abc'
  return '*'.repeat(value.length)
}

console.log(renderFn('My password is {{password}}!', star, { password: 'abc' }))
// My password is ***!
```


You can even resolve asynchronously using the `renderFnAsync()`. For example the following code uses [node-fetch](https://www.npmjs.com/package/node-fetch) to get a task title from the [jsonplaceholder API](https://jsonplaceholder.typicode.com).

```javascript
const { renderFnAsync } = require('micromustache')
const fetch = require('node-fetch')

async function taskTitleFromUrl(url) {
  const response = await fetch(url)
  const obj = await response.json()
  return obj.title
}

console.log(await renderFnAsync('Got {{https://jsonplaceholder.typicode.com/todos/1}}!', fetch))
// Got delectus aut autem
```

If you find yourself working on a particular template too often, you can compile it once and cache the result so the future renders will be much faster. The compiler returns an object with `render()`, `renderFn()` and `renderFnAsync()` methods with the difference that their first parameter is not the template string:

```javascript
const { compile } = require('micromustache')
const compiled = compile('Hello {{name}}! I am {{age}} years old!')
console.log(compiled.render({ name: 'world', age: 42 }))
// Hello world! I'm 42
// The methods are bound so you can use the destructed version for brevity
const { render } = compile
console.log(render({ name: 'world', age: 42 }))
// Hello world! I'm 42
```

*If `compiled` is garbage collected, the cache is freed (unlike some other template engines that dearly keep hold of the compiled result in their cache which leads to memory leaks and out of memory errors over longer usage).*

Using the options you can do all sorts of fancy stuff. For example, here is an imitation of the C# string interpolation syntax:

```javascript
const { render } = require('micromustache')
const $ = scope => strings => render(strings[0], scope, { tags: ['{', '}'] })

const name = 'Michael'
console.log($({ name })`Hello {name}!`)
// Hello Michael!
```

# API

[On github pages](http(s)://userpixel.github.io/micromustache)

# FAQ

[On wiki](https://github.com/userpixel/micromustache/wiki/FAQ)

# Known issues

[On wiki](https://github.com/userpixel/micromustache/wiki/Known-issues)

---

_Made in Sweden 🇸🇪 by [@alexewerlof](https://mobile.twitter.com/alexewerlof)_

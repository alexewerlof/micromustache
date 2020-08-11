[![Downloads](https://img.shields.io/npm/dm/micromustache.svg?style=flat-square)](http://npm-stat.com/charts.html?package=micromustache&from=2017-01-01)
[![GitHub stars](https://img.shields.io/github/stars/userpixel/micromustache?style=flat-square)](https://github.com/userpixel/micromustache/stargazers)
[![Known Vulnerabilities](https://snyk.io/test/github/userpixel/micromustache/badge.svg?style=flat-square)](https://snyk.io/test/github/userpixel/micromustache)
[![GitHub license](https://img.shields.io/github/license/userpixel/micromustache?style=flat-square)](https://github.com/userpixel/micromustache/blob/master/LICENSE.md)
[![Version](https://img.shields.io/npm/v/micromustache.svg?style=flat-square)](http://npm.im/micromustache)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub issues](https://img.shields.io/github/issues/userpixel/micromustache.svg?style=flat-square)](https://github.com/userpixel/micromustache/issues)

# micromustache

![Logo](https://raw.github.com/userpixel/micromustache/master/logo.png)

A **secure**, fast and lightweight template engine with some handy additions.

⛹ Check out **[the playground](https://unpkg.com/micromustache/playground/index.html)**

Think of it as a sweet spot between plain text interpolation and [mustache.js](https://github.com/janl/mustache.js); Certainly not as logic-ful as [Handlebars](http://handlebarsjs.com/)! Sometimes a stricter syntax is the right boundary to reduce potential errors and improve performance. This tool has a limited scope that doesn't attempt to solve everybody's use case, and instead do a specific thing well.

* 🏃 **2x-3x** faster than MustacheJS (_Micromustache is the fastest template engine that doesn't need pre-compilation and still works in CSP environments_)
* 🔒 **Secure** has limits for variable length, number of interpolations, nesting debth and common Javascript pitfalls (`__proto__`, `constructor`, getters/etc). Works in CSP environments (no usage of `eval()` or `new Function()`). Published only with 2FA. [No regexp](https://medium.com/@liran.tal/node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02).
* 🎈 **Lightweight** No dependencies, less than 400 lines of source code, easy to audit, small API surface, easy to pick up
* 🐁 **Small memory footprint** sane caching strategy, no memory leak
* 🏳 **No dependencies**
* ✏ **Bracket notation** support `a[1]['foo']` accessors (mustache.js/handlebar syntax of `a.1.foo` is also supported).
* 🚩 **Meaningful errors** in case of template syntax errors to make it easy to spot and fix. All functions test their input contracts and throw meaningful errors to improve developer experience (DX).
* ⚡ **TypeScript** types included out of the box and updated with every version of the library
* 🐇 Works in node (CommonJS) and Browser (UMD) and EcmaScript 6 Modules (ESM)
* 🛠 Well tested (full test coverage over 120+ tests). Also tested to produce the same results as [Mustache.js](https://github.com/janl/mustache.js/).
* 📖 Full JSDoc documentation

If variable interpolation is all you need, *micromustache* is a [drop-in replacement](src/mustachejs.spec.ts) for MustacheJS (see its differences with [Mustache.js](https://github.com/userpixel/micromustache/wiki/Differences-with-Mustache.js))

[Try it in your browser!](https://npm.runkit.com/micromustache)

# Getting started

Use directly with [UNPKG](https://unpkg.com/browse/micromustache/):

```javascript
import { render } from 'https://unpkg.com/browse/micromustache/dist/micromustache.mjs'
console.log(render('Hello {{name}}!', { name: 'world' }))
// Hello world!
```

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

Why not just use EcmaScript [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)?

Template literals work great when the template and the variables are in the same scope but not so well when the template is in another scope or is not known ahead of time. For example, suppose you had a function like this:

```javascript
function greet(name) {
  return `Hi ${name}!`
}
```

After your function became successful and you got rich 🤑 you may decide to dominate the world and expand to new markets which speak other languages. You need to internationalize it. Adding one more language is easy:

```javascript
function greet(name, lang) {
  // Note the lang parameter that contains a language code
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

That doesn't scale well as you dominate country after country and need to support more languages! Besides, that's just one string! The main problem is that the content (the text) is coupled to the code (the variable interpolation). **Template engines** help you to move the content out of the function and let something else deal with that concern.

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

Now it's better! 😎 All the templates are together and they are easy to update and translate. By default, we use the popular syntax that encloses variable names between double curly braces (`{{` and `}}`) but you can customize _micromustache_ if you prefer something else.
Just like template literals, you can of course reference deep nested objects:

```javascript
const { render } = require('micromustache')
const scope = {
  fruits: [
    { name: 'Apple', color: 'red' },
    { name: 'Banana', color: 'yellow' },
  ]
}
console.log(render('I like {{fruits[1].color}}!', scope))
// I like Bababa!
```

*It worth to note that Mustache and Handlebars don't support `fruits[1].color` syntax and rather expect you to write it as `fruits.1.color`.*

The real power of micromustache comes from letting you resolve a variable name using your own functions! To pass a resolver function, you can use `renderFn()` instead of `render()`:

```javascript
const { renderFn } = require('micromustache')
// Just converts the variable name to upper case
const up = str => str.toUpperCase()

console.log(renderFn('My name is {{Alex}}!', up))
// My name is ALEX!
```

The resolver gets the scope as its second parameter. If you want to lookup a value, there's a `get()` function as well:

```javascript
const { renderFn, get } = require('micromustache')

// Looks up the value and converts it to stars
function star(varName, scope) {
  // varName comes from the template and is 'password' here
  // scope is { password: 'abc' }
  const value = get(scope, varName) // value is 'abc'
  return '*'.repeat(value.length)
}

console.log(renderFn('My password is {{password}}!', star, { password: 'abc' }))
// My password is ***!
```

If you want to resolve a value asynchronously, we got you covered using the `renderFnAsync()` instead of `renderFn()`. For example the following code uses [node-fetch](https://www.npmjs.com/package/node-fetch) to resolve a url.

```javascript
const { renderFnAsync } = require('micromustache')
const fetch = require('node-fetch')

async function taskTitleFromUrl(url) {
  const response = await fetch(url)
  const obj = await response.json()
  return obj.title
}

console.log(await renderFnAsync('Got {{https://jsonplaceholder.typicode.com/todos/1}}!', fetch))
// Got delectus aut autem!
```

If you find yourself working on a particular template too often, you can `compile()` it once and cache the result so the future renders will be much faster. The compiler returns an object with `render()`, `renderFn()` and `renderFnAsync()` methods. The only difference is that they don't get the template and only need a scope:

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

*If the `compiled` variable above is garbage collected, the cache is freed (unlike some other template engines that dearly keep hold of the compiled result in their cache which may leads to memory leaks or **out of memory errors** over longer usage).*

Using the options you can do all sorts of fancy stuff. For example, here is an imitation of the **C#** string interpolation syntax:

```javascript
const { render } = require('micromustache')
const $ = scope => strings => render(strings[0], scope, { tags: ['{', '}'] })

const name = 'Michael'
console.log($({ name })`Hello {name}!`)
// Hello Michael!
```

# API

[On Github pages](https://userpixel.github.io/micromustache/)

# Examples

Check out the [`examples`](./examples) directory.
_Note that they need you to build the project locally._

# FAQ

[On wiki](https://github.com/userpixel/micromustache/wiki/FAQ)

# Known issues

[On wiki](https://github.com/userpixel/micromustache/wiki/Known-issues)

# License

[MIT](./LICENSE.md)

---

_Made in Sweden 🇸🇪 by [@alexewerlof](https://mobile.twitter.com/alexewerlof)_

<a href="https://opencollective.com/micromustache" target="_blank">
  <img src="https://opencollective.com/micromustache/donate/button@2x.png?color=white" width=300 />
</a>

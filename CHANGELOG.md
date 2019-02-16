# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).


## Unrelease

- Add more examples of its selling points
  - C# syntax:       render('I like {{0}}, {{1}} and {{2}}', ['orange', 'apple', 'lemon'])
  - string templates
  - how to use it to emulate string templates for variables out of scope
  - performance vs mustache.js and lodash template engines
- Do a comparative benchmark with Mustache.js
- Add support for [tagged string templates](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)
- Support comments: *{{! ...}}* like MustacheJS
- Test the async behaviour
- Reenable tests/ for mustache compatibility and add relevant options
- Add a string literal tag function (generic render)
- Add the possibility to process variable names before and after they are resolved using `get()`. This can allow HTML escaping for example.
- Add the possibility to return '' instead of throwing for non-existing elements
- Support multiscopes ?

## 6.0.0

- Rewrote the project in TypeScript
- Now the compiler returns a renderer with optimized caching
- Custom resolver can be async
- Can handle es string templates
- BREAKING CHANGE: if you pass a non-string template it'll throw
- BREAKING CHANGE: if the template is not string, we throw an error
- BREAKING CHANGE: if you provide a custom resolver and it throws, we don't swallow that error
- BREAKING CHANGE: if one of the nested keys do not exist, we don't swallow that error

## 5.4.0
- Modernize the the dependencies and build system

## 5.1.0 2017-01-08
- Add command line support

## 5.0.0 2017-01-08
- Update readme
- remove building browser packages (use webpack, browserify or any other modern method to build)
- Command line interface
- Add travis build
- Use linting rules from Schibsted
- Converted to CommonJS (dropped AMD and UMD in favor of modern build tools)
- Use yarn
- Rewrote test with chai.expect instead of chai.assert
- list of params for resolver is reversed to (varName, view)
- dropped to_html alias
- dropped bower support
- dropped CDN support
- dropped this feature: If the value is a function, call it passing the name of the variable as the only argument.

## 2.2.1 - 2016-07-23

- Mainly modernizing the package after 2 years
- Added documentation
- Replaced the old nodeunit test system with mocha/chai
- Replaced the old gulp build system with pure NPM

## 2.1.20 - 2014-07-11

- Replaced makefile with Gulp
- Adapted the UMD pattern to easily work with AMD, CommonJS or even good old style globals
- Removed the test case of Object and Array values (they aren't supported in Micromustache).
- Updated the test runner to use rawgit.com
- Added this changelog

## 1.2.1 - 2013-12-18

- Added new logo
- Released into NPM

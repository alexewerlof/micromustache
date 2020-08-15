# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

- Now we have a `getRef()` function

### BREAKING CHANGES

- v9.0.0: the Renderer is gone
- v9.0.0: `get()` is renamed to `getPath()`
- v9.0.0: all interfaces are renamed to have no "I" prefix. Also the `ITags` interface is removed.
- v9.0.0: parsing paths is now more accurate. As a result of that, a few edge cases that would pass previously will throw an error. For example `a[-11]` was OK before but it's an error now (`a[11]` or `a[+11]` still work as expected). The bracket accessor will only accept numbers or quoted strings (`a["true"]` or `a['true']` work while `a[true]` is an error). So you might want to ensure that your templates don't have such issues.
- v9.0.0: The terminology is update. Instead of "VarName", we use "Path" for the string form of it (as it appears in the template) and "Ref" for when it is parsed to an array of strings
- v9.0.0: The result of `tokenize()` now looks like `{ strings, paths }` instead of `{ strings, varNames }`
- v9.0.0: The `maxVarNameLength` option is renamed to `maxPathLen`
- v9.0.0: The `propsExist` option is renamed to `validateRef`
- v9.0.0: The `validateVarNames` option is renamed to `validatePath`
- v9.0.0: The `depth` option is renamed to `maxRefDepth`
- v9.0.0: The internal `toPath` function is renamed to `parsePath`

## 8.0.0

- The CommonJS file has changed name: V7=`dist/micromustache.js` v8=`dist/micromustache.cjs`. If you just use `require('micromustache')` it should work without any change.
- The `depth` option is added
- Updated the dependencies
- Addressed known security issues

### BREAKING CHANGES

- The `scope` could be a `function` as well, but with this release we only accept `Object`.
- Previously string characters could be accessed with array-index syntax, but now it is not possible (eg. `render('{{str[0]}}', { str: 'Hello' })` will not return `'H'` anymore)
- Drop support for Safari10

## 7.0.0

### BREAKING CHANGES:

- **The CLI is removed**
- Variable names cannot be longer than 1000 characters

## 6.0.0

- We no more try to JSON.stringify() arrays and objects. You can use `.renderFn()` to do that. There's still the `get()` utility function to help do the lookup.
- Object bracket accessors are now supported: `obj['foo']` (previously only `obj.foo` worked like Mustache and handlebars)
- Rewrote the project in TypeScript
- Custom resolver can also be async (see `.renderFnAsync()`)
- Compile and rendering is significantly faster than Mustache
- A change in terminology to better reflect JavaScript terms: What Mustache and the previous version of the lib called `view` is not called `scope`.
- Expose a CommonJS build for the browser limited to ECMAScript 5 features.

### BREAKING CHANGES:
- **The biggest change is that if you used `compile()` in version 5, it returned a function but since version 6, it returns an object that _has_ a `render()` function**
- The behaviour of the resolver function has changed: In v5 if the resolver threw an error we fell back to the standard `.get()` functionality but v6 just throws that error in an effort to make debugging easier.
- We don't use default exports anymore so `const render = require('micromustache/render')`
  should be refactored to `const { render } = require('micromustache')`
- Now the compiler returns a renderer object with a render() function
- If you pass a non-string template it'll throw an error
- If you provide a custom resolver and it throws, we throw and will not swallow that error
- If one of the nested keys do not exist, we throw and will not swallow that error

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
- list of params for resolver is reversed to (path, view)
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

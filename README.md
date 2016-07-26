[![GitHub issues](https://img.shields.io/github/issues/userpixel/micromustache.svg?style=flat-square)](https://github.com/userpixel/micromustache/issues)


# micromustache

![Logo](https://raw.github.com/userpixel/micromustache/master/logo/micromustache-logo-300.png)

This tool covers the most important use case: **interpolation: replacing variable names with their values from an object**.

![Figure 1](https://raw.github.com/userpixel/micromustache/master/fig-1.png)

If that's all you need, micromustache is a drop-in replacement for MustacheJS.

* No dependencies
* Works in node (CommonJS) and Browser (AMD, global, Browserify/WebPack)
* Well tested
* Dead simple to learn yet a pleasure to use
* Well documented with many examples
* Behave exactly like mustache.js for the supported functionalities

**Tradeoff**

Micromustache achieves faster speed and smaller size by dropping:

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
 * @param template {string} the template containing one or more {{variableNames}}
 * @param [view={}] {object} an optional object containing values for every variable names
 *        that is used in the template
 * @return {string} template where its variable names replaced with corresponding values.
 *        If a value is not found or is invalid, it will be assumed empty string ''.
 *        If the value is an object itself, it'll be stringified by JSON.
 *        In case of a JSON error the result will look like "{...}".
 */
micromustache.render(template, view);
```

*Alias: `.to_html()`*

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

micromustache is a bit more forgiving than MustacheJS. For example, if the `view` is `null` or `undefined`, MustacheJS throws an exception but micromustache doesn't.

Another difference (which can handle complicated edge cases) is that you can use functions as values for more flexibility. micromustache will simply call the function with the variable name and use its return value for interpolation:

````js
/**
 * @param key {String} variable name for the current scope.
 *        For hierarchical names like {{a.b.c}} the key can be 'a' or 'b' or 'c'
 * @param currentScope {Object} the current object that the variable is
 *        supposed to resolved from
 * @param path {String[]} useful for hierarchical objects.
 *        for example a variable name like {{a.b.c}} sets the
 *        path to ['a', 'b', 'c']
 * @param currentPointer {Number} the array index to where in the path we are at the
 *        moment. This is usually path.length - 1
 * @return {String|Number|Boolean|Object} the value to be interpolated
 */
function toUpper (key, currentScope, path, currentPointer) {
  // key is the variable name
  // By the way: "this" inside the function refers to the current object
  return key.toUpperCase();
}

micromustache.render('I bought a {{screaming}} {{dog}}!!!', {
  screaming: toUpper,
  dog: toUpper
});
//output = 'I bought a SCREAMING DOG!!!'
````

The function runs **synchronously** in the context of the view object (i.e. `this` refers to the view object). A more complex example:

````js
var viewObject = {
  repository: {
    url: valueFn
  }  
};
function valueFn (key, currentScope, path, pathIndex) {
    // this = viewObject
    // key = 'url'
    // currentScope = viewObject.repository
    // path = ['repository', 'url']
    // pathIndex = 1
    return 'http://github.com/userpixel/micromustache.git';
}
micromustache.render('micromustache is at {{repository.url}}', viewObject);
//output = 'micromustache is at http://github.com/userpixel/micromustache.git'
````


## micromustache.compile()

Function signature:

```js
/**
 * @param template {string} same as the template parameter to .render()
 * @return compiler(view) {function} a function that accepts a view and returns a rendered template
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

## micromustache.to_html()

Just another name for `micromustache.render()` for compatibility with MustacheJS.

# Installation

Download from [browser directory](https://github.com/userpixel/micromustache/tree/master/browser)

[npm](https://npmjs.org/package/micromustache):

```bash
npm install micromustache
```

[Bower](http://bower.io/):

````bash
bower install micromustache
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

# TODO

* Add a command line version similar to
[mustache.js](https://github.com/janl/mustache.js/blob/master/bin/mustache).

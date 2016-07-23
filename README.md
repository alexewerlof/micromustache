[![GitHub issues](https://img.shields.io/github/issues/userpixel/micromustache.svg?style=flat-square)](https://github.com/userpixel/micromustache/issues)


# micromustache

![Logo](https://raw.github.com/hanifbbz/micromustache/master/logo/micromustache-logo-300.png)

A stripped down version of the {{mustache}} template engine with JavaScript.
It covers the most important use case: **replacing variable names with their values from an object**. If that's all you need, micromustache is a drop-in replacement for MustacheJS.

* No devDependencies
* Works in node and Browser
* Well tested
* Behave exactly like mustache.js for the supported functionalities

You can just download it from the `browser` directory or install it with [npm] (https://npmjs.org/package/micromustache):

```bash
npm install micromustache
```

Or [Bower] (http://bower.io/):

````bash
bower install micromustache
````

# Limitations

Micromustache achieves faster speed and smaller size by dropping:

* Array iterations: *{{# ...}}*
* Partials: *{{> ...}}*
* Objects as values: *{{ objName.propertyName }}* (you can use functions though)
* Arrays as values: *{{ objName[propertyName] }}* (you can use functions though)
* Inverted selection: *{{^ ...}}*
* Comments: *{{! ...}}*
* HTML sanitization: *{{{ propertyName }}}*
* Custom delimiters: *<% ... %> instead of {{ ... }}*

# API

micromustache is pretty similar to Mustache so if you know how to use Mustache, you already know Micromustache.

## .render()
```
micromustache.render(
  template  : String,
  view      : Object
) => String
```

*Alias: to_html*

Renders a template with the provided key/values fro the view object. Example:

````js
var person = {
  first: 'Michael',
  last: 'Jackson'
};
var output = micromustache.render('Search {{first}} {{ last }} popcorn!', person);
//output = "Search Michael Jackson popcorn!"
````

You can even access array elements and `length`:

```js
var fruits = [ "orange", "apple", "lemon" ];
var output = micromustache.render("I like {{0}}, {{1}} and {{2}} ({{length}} fruits!)", fruits);
//output = "I like orange, apple and lemon (3 fruits!)"
```

## Differences

micromustache is a bit more liberal than MustacheJS. For example, if the `view` is `null` or `undefined`, MustacheJS throws an exception but micromustache doesn't.

Another difference (which can handle complicated edge cases) is that you can use functions as values for more flexibility. micromustache will simply call the function with the variable name and use its return value for interpolation:

````js
micromustache.render('{{var1}}', {
    var1: function (key) {
        return key.toUpperCase();
    }
});
//output = 'VAR1'
````

The function runs synchronously in the context of the view object (ie. `this` refers to the view object).

## .compile()

```
micromustache.compile(
  template  : String
) => String
```

You can compile the template and get a function that can be used multiple times:

```js
var templateEngine = micromustache.compile('Search {{first}} {{ last }} popcorn!');
output = templateEngine(person);
//output = "Search Michael Jackson popcorn!"
output = templateEngine({first:'Albert',last:'Einstein'});
//output = "Search Albert Einstein popcorn!"
```

# Tests

We use Mocha/Chai for tests:

```
npm test
```

# TODO

Add a command line version similar to
[mustache.js](https://github.com/janl/mustache.js/blob/master/bin/mustache).

#MicroMustache

![Logo](https://raw.github.com/hanifbbz/micromustache/master/logo/micromustache-logo-300.png)

A stripped down version of the {{mustache}} template engine with JavaScript.
It covers the most important use case for Mustache: replacing variables with their names.
MicroMustache doesn't support partials, array and nested objects.
It is about 40% faster than Mustache.js and 93% smaller!
If all you do is variable name replacement, you can easily cut that overhead.

[Download Development Edition] (https://raw.github.com/hanifbbz/micromustache/master/dist/micromustache.js) - 2,65 KB

[Download Production Edition] (https://raw.github.com/hanifbbz/micromustache/master/dist/micromustache.min.js) - 0.5 KB

Or use [npm] (https://npmjs.org/package/micromustache):

```bash
npm install micromustache
```

#Features

* Tiny (less than half a kilo byte)
* Super-Quick (just one function call over the native browser layer)
  [run the comparison] (http://jsperf.com/micromustache-vs-mustache)
* Super efficient (optimum use of CPU, RAM and your memory bandwidth)
* Familiar to Mustache users
* No dependency (No need for JQuery, Underscore, Mustache, etc)
* Cross-browser compatible
* Full test coverage with Qunit.
  [run tests] (https://rawgit.com/hanifbbz/micromustache/master/test/micromustache-test.html)
* Consistent with Mustache.js so it is a drop-in replacement for Mustache or Handlebars
* Supports the following value types: string, number, boolean, function.
  If the value is a function, it'll be called with the name of the variable as its parameter and the resulting value will be used.
* The render(), to_html() and compile() functions are supported from Mustache.js
* It's just one function. You can drop it into your code or paste it as an AMD module
* Works in browser and node.js
* Ready to be used as AMD or just copy/paste into your own code
* Clean code that passes [jshint] (http://www.jshint.com/)
* Made in Sweden

#Limitations

MicroMustache achieves its fast speed and light weight by dropping the following features from Mustache:

* Array iterations: {{# ...}}
* Partials: {{> ...}}
* Objects as values: {{ objName.propertyName }}
* Arrays as values: {{ objName[propertyName] }}
* Inverted selection {{^ ...}}
* Comments: {{! ...}}
* HTML sanitization: {{{ propertyName }}}
* Custom delimiters: <% ... %> instead of {{ ... }}

#How to use

MicroMustache is pretty similar to Mustache so if you know how to use Mustache,
you can easily replace it with MicroMustache without any code change.

```js
var person = {
  first: "Alex",
  last: "Ewerlöf"
};

//The render function accepts two parameters: the template and the object that contains a list of key-values to be replaced in template.
var output = MicroMustache.render("MicroMustache is created by {{first}} {{ last }}", person);
//output = "MicroMustache is created by Alex Ewerlöf"
```

Alternatively you can compile the template and get a function that can be used multiple times:

```js
var templateEngine = MicroMustache.compile("MicroMustache is created by {{first}} {{ last }}");
output = templateEngine(person);
//output = "MicroMustache is created by Alex Ewerlöf"
output = templateEngine({first:'Albert',last:'Einstein'});
//output = "MicroMustache is created by Albert Einstein"
```

It is easy to access array elements:

```js
var fruits = [ "orange", "apple", "lemon" ];

var output = MicroMustache.render("I like {{0}}, {{1}} and {{2}}", fruits);
//output = "I like orange, apple and lemon"
```

##Functions

The following functions from Mustache.js are supported:

```js
MicroMustache.render(template,view);//renders a template based on the data in the view object and returns the rendered string
MicroMustache.to_html(template,view);//same as render
MicroMustache.compile(template);//returns a function that accepts the view object and spits out the rendered string
```

## Using as an AMD module

MicroMustache doesn't have any assumption about how it is used.
If you want to use it as an AMD module, just copy/paste the contents of
[micromustache.js] (https://raw.github.com/hanifbbz/micromustache/master/dist/micromustache.js)
and replace the first line of code from:

`var MicroMustache = (function () {` to `define(function () {`
and the last line of code from `})();` to `});`.

Then you can easily use it like:

```js
require( 'MicroMustache', function ( MicroMustache ) {
    alert(MicroMustache.render('{{var}}',{var:'val'}));
});
```

For more examples see the micromustache-test.js inside the test directory above.

#Algorithm

The algorithm behind MicroMustache is rather simple.
But for the sake of clarity, here is what the `render()` function does:

* Search the code for all occurrences of `{{...}}`
* Lookup a key inside the provided `view` object that matches what is between `{{` and `}}`
* If the value is a number, boolean or string, replace the `{{...}}` with the value
* If the value is a function, call it passing what is between `{{` and `}}` and replace the `{{...}}` with the return of the function
* If the value is an object, array or null, (or anything else) just remove the `{{...}}` part

#Build

If you want to modify the code, here is how to do it.

1. Install Node.js (hence `npm`)
2. Clone this repository and go to the directory you cloned it
3. Run `npm install`
4. Do your changes and run the tests. When you are happy go to the next step.
5. Run `gulp` and if there's no issue, it should make two new javascript files in the `dist` directory.
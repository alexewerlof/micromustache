# Install and run

The performance tests require dependencies that doesn't make sense to put in the main package so it
has its own `package.json`.
It also needs the micromustache lib to be built, so do an `npm run build` in the root before running performance tests.
Simply run `npm it` to install and run the performance tests.

# Conclusions

All the competing template engines are good at what they do.
There's been tremendous effort put into designing and optimizing them.
But like any other library, there are trade-offs.
Most other template engines are very flexible and featurefull and that is why they are slower than
micromustache and when they are faster, they are using unsafe JavaScript syntax with no exception.

The aim for micromustache is to be minimal, secure and fast.

This directory contains a series of performance tests against other libraries.
For the sake of completeness it also includes some performance tests for native javascript features
although to be fait, the native javascript does not cover the use case for a template engine.

Many of these templates compile the template to a JavaScript function using `new Function()`
or `eval()` but they will not run in a Content Security Policy (CSP) environment like Chrome Extensions
or other browser windows with high security measures.

Some of these libraries (notably Handlebars and mustache) does not support the JavaScript accessors like `cities[1]`
and one has to use a syntax that is faster to parse but is not fluent to JavaScript developers: `cities.1`.
In case of Handlebars, the syntax is even more innovative `cities.[1]`

In case of Mustache.js (which was the original inspiration for this library), a few more things need to be said:

* Mustache aggressively caches all tokenization results and may use more memory with every distinct template
* Currently there is no easy way to compile the templates in Mustache (see the code in `./mistache.js`)
* Mustache does not have the concept or resolver, and of course it cannot resolve asynchronously

Mozilla Nunjucks also provides a render function but it was too slow to be included in the performance benchmarks.

Dot and Template7 are the fastest template engines. Dot has a slightly verbose syntax if you come from Mustache or Handlebars background. Besides Dot, prints out 'undefined' for fields that are not defined (Mustache-like libs return "").

Underscore, lodash and EJS have a verbose syntax too: `<%= cities[2] %>`

an interesting discovery is that ES Template Literals are not actually the fastest way to build strings.
String array joins aren't either. Good old string concatenation is the fastest way.

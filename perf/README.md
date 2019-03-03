This directory contains a series of performance tests against other libraries.
For the sake of completeness it also includes some performance tests for native javascript features
although to be fait, the native javascript does not cover the use case for a template engine.

Many of these templates compile the template to a JavaScript function using `new Function()`
or `eval()` but they will not run in a Content Security Policy (CSP) environment like Chrome Extensions
or other browser windows with high security measures.

Some of these libraries (notably Handlebars and mustache) does not support the JavaScript accessors like `cities[2]`
and one has to use a syntax that is faster to parse but is not fluent to JavaScript developers: `cities.2`.

In case of Mustache.js (which was the original inspiration for this library), a few more things need to be said:

* Mustache aggressively caches all tokenization results and may use more memory with every distinct template
* Currently there is no easy way to compile the templates in Mustache (see the code in `./mistache.js`)
* Mustache does not have the concept or resolver, and of course it cannot resolve asynchronously

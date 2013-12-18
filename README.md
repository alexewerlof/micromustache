#Download

[Development Edition] (https://raw.github.com/hanifbbz/micromustache/master/dist/micromustache.js) - 2,487 Bytes

[Production Edition] (https://raw.github.com/hanifbbz/micromustache/master/dist/micromustache.min.js) - 448 Bytes

#MicroMustache

A stripped down version of the {{mustache}} template engine with JavaScript.
It covers the most important use case for Mustache: replacing variables with their names.
MicroMustache doesn't support partials, array and nested objects.
It is about 40% faster than Mustache.js and less 93% smaller!

* Tiny (less than 0.5KB)
* Super-Quick (just one function call over the native browser layer) [run the comparison] (http://jsperf.com/micromustache-vs-mustache)
* Super efficient (no extra variable created, tested for memory leaks)
* Familiar to Mustache users (uses the same {{}} convention as well as the render() function)
* No dependency (No need for JQuery, Underscore, Mustache, etc)
* Cross-browser compatible
* Full test coverage with Qunit
* Consistent with Mustache.js so it is a drop-in replacement for Mustache or Handlebars
* Supports the following value types: string, number, boolean, function.
  If the value is a function, it'll be called with the name of the variable as its parameter and the resulting value will be used.
* The render(), to_html and compile() functions are supported from Mustache.js
* It's just one function. You can drop it into your code or paste it as an AMD module

#Not included

MicroMustache achieved great speed and small size by dropping the following features from Mustache:

* Array iterations: {{# ...}}
* Partials: {{> ...}}
* Objects as values: {{ objName.propertyName }}
* Inverted selection {{^ ...}}
* Comments: {{! ...}}
* HTML sanetization: {{{ propertyName }}}
* Custom delimiters: <% ... %> instead of {{ ... }}

#Examples

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

The following functions from Mustache.js are supported:

```js
MicroMustache.render(template,view);//renders a template based on the data in the view object
MicroMustache.to_html(template,view);//same as render
MicroMustache.compile(template);//returns a function that accepts the view object and spits out the rendered string
```

For more examples see the micromustache-test.js inside the test directory above.

#Upcomming features

* Plugins to change the {{}} to another markup of your choice
* Plugin for supporting array traversal
* Plugin for supporting nested objects
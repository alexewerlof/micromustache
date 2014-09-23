#micromustache

![Logo](https://raw.github.com/hanifbbz/micromustache/master/logo/micromustache-logo-300.png)

A stripped down version of the {{mustache}} template engine with JavaScript.
It covers the most important use case for Mustache: replacing variable names with their values from an object.
micromustache doesn't support partials, array and nested objects.
It is about +40% faster than Mustache.js and +90% smaller!
[Run comparison.] (http://jsperf.com/micromustache-vs-mustache)
If all you do is variable name replacement, you can easily cut that overhead 
by dropping Micromustache into your code instead of Mustache.
It is consistent with Mustache and supports the following API:
```js
micromustache.render(template,view);//renders a template based on the data in the view object and returns the rendered string
micromustache.to_html(template,view);//same as render
micromustache.compile(template);//returns a function that accepts the view object and spits out the rendered string
```


[Download With Comments] (https://raw.github.com/hanifbbz/micromustache/master/dist/micromustache.js)

[Download Minified] (https://raw.github.com/hanifbbz/micromustache/master/dist/micromustache.min.js)

Or use [npm] (https://npmjs.org/package/micromustache):

```bash
npm install micromustache
```

Or {Bower] (http://bower.io/)

````bash
bower install micromustache
````

#Limitations

Micromustache achieves faster speed and smaller size by dropping:

* Array iterations: *{{# ...}}*
* Partials: *{{> ...}}*
* Objects as values: *{{ objName.propertyName }}*
* Arrays as values: *{{ objName[propertyName] }}*
* Inverted selection: *{{^ ...}}*
* Comments: *{{! ...}}*
* HTML sanitization: *{{{ propertyName }}}*
* Custom delimiters: *<% ... %> instead of {{ ... }}*

#How to use

micromustache is pretty similar to Mustache so if you know how to use Mustache, you already know Micromustache.

````js
var person = {
  first: "Alex",
  last: "Ewerlöf"
};
//The render function accepts two parameters: the template and the object that contains a list of key-values to be replaced in template.
var output = micromustache.render("micromustache is created by {{first}} {{ last }}", person);
//output = "micromustache is created by Alex Ewerlöf"
````

Alternatively you can compile the template and get a function that can be used multiple times:

```js
var templateEngine = micromustache.compile("micromustache is created by {{first}} {{ last }}");
output = templateEngine(person);
//output = "micromustache is created by Alex Ewerlöf"
output = templateEngine({first:'Albert',last:'Einstein'});
//output = "micromustache is created by Albert Einstein"
```

It is easy to access array elements as well:

```js
var fruits = [ "orange", "apple", "lemon" ];
var output = micromustache.render("I like {{0}}, {{1}} and {{2}}", fruits);
//output = "I like orange, apple and lemon"
```

You can even use functions as values for more flexibility:

````js
micromustache.render('{{var1}}', {
    var1: function (key) {
        return key.toLocaleUpperCase();
    }
});
//output = 'VAR1'
````

For more examples see the micromustache.test.js inside the test directory above.
# Terminology

* *Scope*: The object that'll be used to resolve values.
In Mustache it is called View.
* *Rendering*: filling in the template with the values from an object.
For every variable name we call the *resolve* function.
* *Compiling*: parsing a template and creating a renderer
* *Parsing*: as step during compilation: breaking a template into parts
* *Tokenization*: going through the parsed results and creating tokens for
variable names
* *Resolving*: looking up the value for a variable name (can be async if you
want)
* *Path*: is an array of keys that can be used to access a nested property from
an object. Each part of the path array is called a `key`.
* *Stringification*: the process of putting everything together and creating the
final string result

The flow is like this:

```
render()
\___ compile()
        |___tokenize()
        |       \___parse()
        \___resolve()
                \___stringify()
```

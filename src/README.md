# Terminology

* *VarName*: is a string that is used in the template to refer to a value`
* *Scope*: The object that'll be used to resolve values. _(In Mustache it is called View.)_
* *Rendering*: interpolating the varNames in a template with their value.
* *Resolving*: looking up the value for a varName
* *Compiling*: parsing a template and creating a renderer
* *Renderer*: an object that holds a parsed template and have methods for rendering.
* *Parsing*: as step during compilation for breaking a template into parts
* *Tokenization*: going through the parsed results and creating tokens for varNames
* *PropNames*: is an array of property names that can be used to access a nested
property from an object.
* *Stringification*: the process of putting everything together and creating the
final string result _(in compiler slag it is called a generator)_
* *Tag* the strings that are used for marking varNames in the template. By default they are '{{' and '}}' respectively.

The flow is like this:

```
render()
  \___ compile()
         |___tokenize()
         |       \___parse()
         \___resolve()
                \___stringify()
```

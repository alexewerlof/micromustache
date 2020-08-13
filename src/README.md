# Terminology

Let's get familiar with a few terms as they are used across this repo:

* **VarName**: is a string that is used in the template to refer to a value
* **Scope**: The object that'll be used to resolve values (called _view_ in Mustache.JS)
* **Parsing**: converting a varName to an array of paths that can be used to lookup a value from the scope
* **Resolving**: looking up the value for a varName (either from the scope or using your own resolver function)
* **Rendering**: interpolating the varNames in a template with their resolved value
* **Tokenization**: breaking the template into constant strings and varNames that need resolving
* **Renderer**: an object that holds a tokenized template and have methods for rendering
* **Compiling**: tokenizing a template and creating a renderer object
* **Stringification**: putting the tokenized strings together with the resolved value for every varName and creating the
final string result (in compiler slang it is called _generator_)
* **Tag** the strings that are used for marking varNames in the template. By default they are '{{' and '}}' respectively

At a high level flow for a typical render looks like this:

```
1. render()
   |__ 2. compile()
          |__ 3. tokenize()
          |__ 4. resolve()
                 |__ 5. get() or resolveFn()
                 |__ 6. stringify()
```

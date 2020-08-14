# Terminology

Let's get familiar with a few terms as they are used across this repo:

* **Ref**: is a string that is used in the template to refer to a value (Example: `person.name`)
* **Path**: is an array that is derived from a **Ref** (Example: `['person', 'name']`)
* **Scope**: The object that'll be used to resolve values (called _view_ in Mustache.JS)
* **Parsing**: converting a **Ref** to a **Path** that can be used to lookup a value from the **Scope**
* **Value**: the value that will be used to interpolate a ref in the template
* **Resolving**: looking up the **value** for a **Ref** (either from the **Scope** or using your own resolver function)
* **Rendering**: interpolating the **Refs**s in a template with their resolved value
* **Tokenization**: breaking the template into constant strings and **Refs** that need resolving
* **Renderer**: an object that holds a tokenized template and have methods for rendering
* **Compiling**: tokenizing a template and creating a **Renderer** object
* **Stringification**: putting the resolved **Value** for every **Ref** and creating the
final string result (in compiler slang it is called _generator_)
* **Tag** the strings that are used for marking refs in the template. By default they are '{{' and '}}' respectively

At a high level flow for a typical render looks like this:

```
1. render()
   |__ 2. compile()
          |__ 3. tokenize()
          |__ 4. resolve()
                 |__ 5. get() or resolveFn()
                 |__ 6. stringify()
```

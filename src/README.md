# Terminology

Let's get familiar with a few terms as they are used across this repo:

* **Path**: is a string that is used in the template to refer to a value (Example: `person.name`)
* **Ref**: is an array that is derived from a **path** (Example: `['person', 'name']`)
* **Scope**: The object that'll be used to resolve values (called _view_ in Mustache.JS)
* **Tokenization**: converting a **path** to a **ref** that can be used to lookup a value from the **Scope**
* **Value**: the value that will be used to interpolate a path in the template
* **Resolving**: looking up the **value** for a **path** (either from the **Scope** or using your own resolver function)
* **Rendering**: interpolating the **Paths**s in a template with their resolved value
* **Parsing**: breaking the template into constant strings and **Paths** that need resolving
* **Renderer**: an object that holds a tokenized template and have methods for rendering
* **Compiling**: tokenizing a template and creating a **Renderer** object
* **Stringification**: putting the resolved **Value** for every **path** and creating the
final string result (in compiler slang it is called _generator_)
* **Tag** the strings that are used for marking paths in the template. By default they are '{{' and '}}' respectively

At a high level flow for a typical render looks like this:

```
1. render(template, scope)
|__ 2. compile(template)
|   |__ 3. parseTemplate(template) -> strings, paths
|   |__ 4. tokenizePath(paths) -> refs
|
|__ 5. refGet(ref, scope) -> values
|__ 6. stringify(strings, values) -> result
```

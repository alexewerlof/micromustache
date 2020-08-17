# Terminology

Let's get familiar with a few terms as they are used across this repo:

* **Template**: is a string that contains paths between open and close tags (Example: `Hi {{person.name}}!`).
* **Tag** the strings that are used for marking **path**s in the **template**. By default they are '{{' and '}}' respectively
* **Path**: is a string that is used in the **template** to refer to a value (Example: `person.name`)
* **Ref**: is an array that is derived from a **path** (Example: `['person', 'name']`)
* **Scope**: The object that'll be used to resolve values (called _view_ in Mustache.JS)
* **Tokenization**: converting a **path** to a **ref** that can be used to lookup a value from the **Scope**
* **Value**: the value that will be used to interpolate a path in the **template**
* **Resolving**: looking up the **value** for a **path** (either from the **Scope** or using your own resolver function). You can provide your own resolving functions using [[resolveFn]] and [[resolveFnAsync]].
* **Rendering**: interpolating the **Paths**s in a **template** with their resolved value
* **Parsing**: breaking the **template** into constant strings and **Paths** that need resolving
* **Renderer**: an object that holds a tokenized **template** and have methods for rendering
* **Compiling**: tokenizing a **template** and creating a **Renderer** object
* **Stringification**: putting the resolved **Value** for every **path** and creating the
final string result (in compiler slang it is called _generator_)
* **transform** maps the variable part of the parsedToken using a function

---

**Templates** can be parsed by [[compile]] or [[parseTemplate]]. The difference being [[compile]] tries to parse what's between the open and close tags while [[parseTemplate]] treats them as plain strings.

---

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

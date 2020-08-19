# Terminology

Let's get familiar with a few terms as they are used across this repo:

* **Template**: is a string that contains paths between open and close tags (Example: `Hi {{person.name}}!`). A template is parsed to `strings` (the fixed parts) and `subs` (the substitutions part).
* **Tag** the strings that are used for marking **path**s in the **template**. By default they are '{{' and '}}' respectively
* **Path**: is a string that is used in the **template** to refer to a value (Example: `person.name`)
* **Ref**: is an array that is derived from a **path** (Example: `['person', 'name']`)
* **Scope**: The object that'll be used to resolve values (called _view_ in Mustache.JS)
* **Value**: the value that will be used to interpolate a path in the **template**
* **Resolving**: looking up the **value** for a **path** (either from the **Scope** or using your own resolver function). You can provide your own resolving functions using [[resolveFn]] and [[resolveFnAsync]].
* **Rendering**: interpolating the **Paths**s in a **template** with their resolved value
* **Parsing**: breaking the **template** into constant strings and **Paths** that need resolving
* **Renderer**: an object that holds a tokenized **template** and have methods for rendering
* **Compiling**: tokenizing a **template** and converting the **paths** to **ref**s
* **Stringification**: putting the resolved **Value** for every **path** and creating the
final string result (in compiler slang it is called _generator_)

---

**Templates** can be parsed by [[compile]] or [[parse]]. The difference being [[compile]] tries to parse what's between the open and close tags while [[parse]] treats them as plain strings.

---

At a high level flow for a typical render looks like this:

```
1. render(template, scope)
|__ 2. compile(template)
|   |__ 3. parse(template) -> strings, paths
|   |__ 4. pathToRef(paths) -> refs
|
|__ 5. refGet(ref, scope) -> values
|__ 6. stringify(strings, values) -> result
```

# ParsedTemplate

![template, tags, strings, path and parsedTemplate](https://docs.google.com/drawings/d/e/2PACX-1vRE87bGkAGC4GG-UtPy1pt8Hh_kh0H6l98qFYYgW63CGLzl1NY6pmhturNOsfxn_vp7jpOp268hCT8V/pub?w=1000)

_([edit](https://docs.google.com/drawings/d/16UKBDWKA0StgvWTqcHFlh-gUKFdRezZ_z5mvmKL3bEA/edit))_

# CompiledTemplate

![from parsedTemplate to compiledTemplate](https://docs.google.com/drawings/d/e/2PACX-1vTPA9RUOHkvY31Iq0GFs_LeqDGNtehulQg0Ole4MPxnCVBdwffcEiHDPrY78ZZvbNKxcrPlS6rSrenX/pub?w=1000)

_([edit](https://docs.google.com/drawings/d/1SiY4Yu9QSDd4xULAvuVjPjk0S3TGGruzkjClfSleQeg/edit))_

# resolve()

![rendering a compiledTemplate](https://docs.google.com/drawings/d/e/2PACX-1vSB3dqwHl3svrDPaZz8Czf2aEYB9UywPyZsPOL9QZ6soRa1RAYJvIhvjDuy_hxAMeJiU6dBVD3yFo9a/pub?w=1000)

_([edit](https://docs.google.com/drawings/d/1Yro-Hn3o6zL02HxPFM9hidgGOUa6xU1jbuuHbL3Xle8/edit))_

# strinfigy()

![stringify a parsedTemplate](https://docs.google.com/drawings/d/e/2PACX-1vSCyL6pUpWmHn_q9lfhigtXHQrc0UBZ9bawL9IHFFEcUKsY-ZU0AdSdUgO7Mx9X5tVCJ_ZL8MQzGLFY/pub?w=1000)

_([edit](https://docs.google.com/drawings/d/1XmGzrnhEodS02LcAj5F-KihmkBHj-h-xuGUEGCWFpHE/edit))_

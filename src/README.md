# Terminology

* *Rendering*: filling in the template with the values from an object. For every variable name we call the *resolve* function.
* *Compiling*: parsing a template and creating a renderer
* *Resolving*: looking up the value for a variable name (can be async if you want)
* *Tokenization*: as step during compilation: breaking a template into parts: strings and variable names that require resolving (AKA *Token*)

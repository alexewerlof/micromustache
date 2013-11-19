#Altemp

A stripped down mustache-like template engine.

#Why?

I love Mustache but when it's too much overhead for the simple templates I have at hand.
This library is based on a subset of Mustache's syntax: replacing variable names with their values.
Specially when you need to replace a bunch of variables in a string.

* Tiny (less than 0.5KB)
* Super-Quick (just one function call over the native replace() call with linear execution time)
* Super efficient (no extra variable created, tested for memory leaks)
* Well-tested (Full coverage of Qunit)
* Familiar to Mustache users (uses the same {{}} convention as well as the render() function)
* No dependency (No need for JQuery, Underscore, Mustache, etc)
* Cross-browser compatibility

#Why not?

If you have loops or objects in your data, you can't use Altemp.
The algorithm is optimized for quick execution and if your data is anything more complicated than a flat
dictionary you can use any other alternatives including Mustache.js itself.

#FAQ

##What is not included?

The following features from Mustache are intentionally not present:

* Array traverse (but you can use the function feature to achieve the same effect)
* Multi-level objects (you can use the function feature to achieve that effect to some extent)
* Partials
* HTML sanetization (you can sanetize it externally if you want)
* Tipple mustache (nothing is sanetized by default)
* Inverted selection
* Set delimiters (you can edit and modify the source code to change it though)

## What's different from Mustache?

* only alphanumeric characters are allowed in a variable's name (dollar sign or underline is not allowed)
* variable names can begin with numbers (but the corresponding key needs to be the string equivalent of that number)

## What features are present?

The following features however are present (and shared with Mustache):

* Marking variables with {{}}
* Replacing string values
* Replacing numerical values
* Replacing boolean values
* Replacing function values. The function will be called with the name of the key as its only parameter
* The render() function
* The compile() function (though they don't improve speed, but they make the repetitive code cleaner to read)
* Comments (technically anything that is not an alphanumeric variable name will be ignored)

##Where does the name come from?
The name Altemp stands for Alex's Template engine.

## Why variable names cannot include $ and _ just like Javascript?

For having a faster execution, we only use the \w regular expression.
Besides every character in the code counts, so a shorter regular expression means a smaller file.

#Examples

For more examples see the micromustache-test.js inside the test directory above.

#Future works

* Plugins to change the {{}} to another markup of your choice
* Plugin for supporting array traversal
* Plugin for supporting nested objects
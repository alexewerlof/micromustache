
Micromustache comes with a simple CLI that brings the `render()` functionality to shell programming.

You can install it using:

```bash
npm i -g micromustache
```

This will make the `micromustache` command available on your shell.
It works like this:

```bash
micromustache templatePath scopePath
```

Both parameters are required.
* `templatePath`: path to a template text file that contains {{varName}} in it
* `scopePath`: path to a valid json file

Files are read/write with _utf8_ encoding.
By default CLI prints the output to console (and erros to stderr).
You can redirect it to output file using `> outputFileName`.

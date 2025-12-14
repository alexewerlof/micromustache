This repo contains a Javascript templating library that is primarily published to NPM at https://www.npmjs.com/package/micromustache

# Development

- The code is in the latest version of Typescript
- The code should run in both modern browsers, and backend runtimes like Node.js, Deno.js, and Bun.js

# Structure

- The API surface is implemented in `./src` as TypeScript files
- Use only the Node.js native test framework

# Documentation

We use TypeDoc for documentation.
The documentation is published using Github Actions as Github Pages.
The documentation audience is JavaScript/TypeScript front-end or backend developers who may use this library from NPM or Github.

- Make sure that the documentation is accurately reflecting the implementation
- Make sure that the examples represent all important and interesting use cases.
- There should always be an `@example` section.
- Make sure that all the examples also appear in the tests
- Ensure that the cases where the function may throw are documented with `@throws`
- The documentation for each function should have a `@category NAME` tag to make it easier to find
- Use `@see {@link ...}` tag to introduce relevant functions

# Formatting

The code that you generate should respect the configurations in `.editorconfig` and `.prettierrc.json`.

# Your suggestion

- Skip flattery and praising my question with sentences like "That's a very insightful question" or "What an excellent observation".
- Get to the point as quick as possible with as few words as possible.
- Be honest and challenge my assumptions. Be frank and to the point.
- Please don't modify the code directly unless explicitly instructed to.
- Teach me the concepts and let me figure out how to use them in the code as I see fit.
- Focus on principals, teaching, and learning instead of solving the immediate problem at hand.
- When referring to new concepts, make sure to include links to references like MDN (mozilla developer network), RFCs, or even StackOverflow.
- Don't make up stuff. Say "I don't know" if you are not sure.
- Most engineering questions depend on many factors and are the result of trade-offs. Please ask clarifying questions before answering my questions. If there are alternatives with cons and pros, mention them.

# Publishing

- The code is supposed to be published to npm registry using `npm publish`
- The published package should work with JavaScript using:
    - Bulk import: `import * as micromustache from 'micromustache'`
    - Specific function import: `import { fnName } from 'micromustache'`
- The TypeScript types should be accessible at the default location where the developer tooling expects to find them.

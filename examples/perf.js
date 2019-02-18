const os = require('os')
const assert = require('assert')
const { compile, compileTag, render, renderTag } = require('../lib/index')
const mustache = require('mustache')
const handlebars = require('handlebars')
const template7 = require('template7')
const template = require('lodash.template')
const underscore = require('underscore')
const dot = require('dot')
const ejs = require('ejs')
const nunjucks = require('nunjucks')

const iterations = 1e5

const testObject = {
  name: 'Alex Ewerlöf',
  age: 37,
  nested: {
    foo: 'bar'
  },
  cities: ['Kiruna', 'Stockholm', 'Malmö']
}

const expectedOutput = `Hi, My name is ${testObject.name}! I am ${
  testObject.age
} years old and live in ${testObject.cities[1]}. foo is ${testObject.nested.foo}.`

const micromustache_compile_renderer = compile(
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.'
)
function micromustache_compile(obj) {
  return micromustache_compile_renderer.render(obj)
}

const micromustache_compiledTag_renderer = compileTag()`Hi, My name is ${'name'}! I am ${'age'} years old and live in ${'cities.1'}. foo is ${'nested.foo'}.`
function micromustache_compileTag(obj) {
  return micromustache_compiledTag_renderer.render(obj)
}

function micromustache_render(obj) {
  const renderer = compile(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.'
  )
  return renderer.render(obj)
}

function micromustache_renderTag(obj) {
  const renderer = compileTag()`Hi, My name is ${'name'}! I am ${'age'} years old and live in ${'cities.1'}. foo is ${'nested.foo'}.`
  return renderer.render(obj)
}

const mustache_writer = new mustache.Writer()
const mustache_compile_tokens = mustache_writer.parse(
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.'
)
function mustache_compile(obj) {
  return mustache_writer.renderTokens(mustache_compile_tokens, new mustache.Context(obj))
}

function mustache_render(obj) {
  mustache.clearCache()
  return mustache.render(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.',
    obj
  )
}

// Fast but doesn't work in CSP environments https://github.com/wycats/handlebars.js/issues/1443
const handlebars_render_renderer = handlebars.compile(
  // Note the array syntax!
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.[1]}}. foo is {{nested.foo}}.'
)
function handlebars_compile(obj) {
  return handlebars_render_renderer(obj)
}

// Compiles to javascript and uses eval which is not compatible with CSP environments
const template7_compile_renderer = template7.compile(
  // Note the array syntax!
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities[1]}}. foo is {{nested.foo}}.'
)
function template7_compile(obj) {
  return template7_compile_renderer(obj)
}

// Lodash is based on doT as well and won't work in CSP environments. You have to use the CLI to precompile
const lodash_compile_renderer = template(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)
function lodash_compile(obj) {
  return lodash_compile_renderer(obj)
}

// underscore doesn't work in CSP environments
const underscore_compile_renderer = underscore.template(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)
function underscore_compile(obj) {
  return underscore_compile_renderer(obj)
}

// Compiles to js functions, so it is not CSP compatible.
// How about templates having access to your file system? https://github.com/mde/ejs/issues/111
const ejs_compile_renderer = ejs.compile(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)
function ejs_compile(obj) {
  return ejs_compile_renderer(obj)
}

// Mozilla's Nunjucks: nunjucks does not sandbox execution so it is not safe to run user-defined templates or inject user-defined content into template definitions. On the server, you can expose attack vectors for accessing sensitive data and remote code execution. On the client, you can expose cross-site scripting vulnerabilities even for precompiled templates (which can be mitigated with a strong CSP). See this issue for more information.
// link: https://mozilla.github.io/nunjucks/templating.html
const nunjucks_compile_renderer = nunjucks.compile(
  'Hi, My name is {{ name }}! I am {{ age }} years old and live in {{ cities[1] }}. foo is {{ nested.foo }}.'
)
function nunjucks_compile(obj) {
  return nunjucks_compile_renderer.render(obj)
}

// Compiles the template to a super optimized javascript code but does it work with CSP security?
const dot_compile_renderer = dot.template(
  'Hi, My name is {{=it.name}}! I am {{=it.age}} years old and live in {{=it.cities[1]}}. foo is {{=it.nested.foo}}.'
)
function dot_compile(obj) {
  return dot_compile_renderer(obj)
}

function es_string_templates(obj) {
  return `Hi, My name is ${obj.name}! I am ${obj.age} years old and live in ${
    obj.cities[1]
  }. foo is ${obj.nested.foo}.`
}

console.info(`CPU: ${os.cpus()[0].model}`)
console.info(`RAM: ${(os.totalmem() / 2 ** 30).toFixed(1)} GiB`)
console.info(`OS: ${os.platform()}`)
console.info(`Iterations: ${iterations} times`)

for (const f of [
  micromustache_compile,
  micromustache_compileTag,
  micromustache_render,
  micromustache_renderTag,
  mustache_compile,
  mustache_render,
  handlebars_compile,
  template7_compile,
  lodash_compile,
  underscore_compile,
  ejs_compile,
  nunjucks_compile,
  dot_compile,
  es_string_templates
]) {
  console.log('---')
  assert.equal(f(testObject), expectedOutput)
  console.time(f.name)
  for (let iteration = 0; iteration < iterations; iteration++) {
    f(testObject)
  }
  console.timeEnd(f.name)
}

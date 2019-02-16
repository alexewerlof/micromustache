const assert = require('assert')
const { compile, compileTag, render, renderTag } = require('../lib/index')
const { render: mustacheRender } = require('mustache')
const handlebars = require('handlebars')
const template7 = require('template7')
const template = require('lodash.template')
const underscore = require('underscore')
const dot = require('dot')
const ejs = require('ejs')
const nunjucks = require('nunjucks')

const iterations = 100000

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

function mustache_render(obj) {
  return mustacheRender(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.',
    obj
  )
}

// Fast but doesn't work in CSP environments https://github.com/wycats/handlebars.js/issues/1443
const handlebars_template = handlebars.compile(
  // Note the array syntax!
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.[1]}}. foo is {{nested.foo}}.'
)
function handlebars_render(obj) {
  return handlebars_template(obj)
}

// Compiles to javascript and uses eval which is not compatible with CSP environments
const template7_template = template7.compile(
  // Note the array syntax!
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities[1]}}. foo is {{nested.foo}}.'
)
function template7_render(obj) {
  return template7_template(obj)
}

const lodash_template_renderer = template(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)
function lodash_template(obj) {
  return lodash_template_renderer(obj)
}

const underscore_template_renderer = underscore.template(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)
function underscore_template(obj) {
  return underscore_template_renderer(obj)
}

const ejs_template_renderer = ejs.compile(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)
function ejs_template(obj) {
  return ejs_template_renderer(obj)
}

const nunjucks_compiled_renderer = nunjucks.compile(
  'Hi, My name is {{ name }}! I am {{ age }} years old and live in {{ cities[1] }}. foo is {{ nested.foo }}.'
)
function nunjucks_compile(obj) {
  return nunjucks_compiled_renderer.render(obj)
}

// Very very long!
function nunjucks_render(obj) {
  return nunjucks.renderString(
    'Hi, My name is {{ name }}! I am {{ age }} years old and live in {{ cities[1] }}. foo is {{ nested.foo }}.',
    obj
  )
}

// Compiles the template to a super optimized javascript code but does it work with CSP security?
const dot_template_renderer = dot.template(
  'Hi, My name is {{=it.name}}! I am {{=it.age}} years old and live in {{=it.cities[1]}}. foo is {{=it.nested.foo}}.'
)
function dot_template(obj) {
  return dot_template_renderer(obj)
}

function es_string_templates(obj) {
  return `Hi, My name is ${obj.name}! I am ${obj.age} years old and live in ${
    obj.cities[1]
  }. foo is ${obj.nested.foo}.`
}

if (!global.gc) {
  throw new Error(`Run node with the --expose-gc switch`)
}

for (const f of [
  micromustache_compile,
  micromustache_compileTag,
  micromustache_render,
  micromustache_renderTag,
  mustache_render,
  handlebars_render,
  template7_render,
  lodash_template,
  underscore_template,
  ejs_template,
  nunjucks_compile,
  nunjucks_render,
  dot_template,
  es_string_templates
]) {
  console.log('---', f.name)
  assert.equal(f(testObject), expectedOutput)
  // global.gc()
  const memoryUsageBefore = process.memoryUsage()
  console.time(f.name)
  for (let iteration = 0; iteration < iterations; iteration++) {
    f(testObject)
  }
  console.timeEnd(f.name)
  // global.gc()
  const memoryUsageAfter = process.memoryUsage()
  const rssDelta = memoryUsageAfter.rss - memoryUsageBefore.rss
  const heapUsedDelta = memoryUsageAfter.heapUsed - memoryUsageBefore.heapUsed
  console.log(`RSS ${rssDelta}, Heap ${heapUsedDelta}`)
}

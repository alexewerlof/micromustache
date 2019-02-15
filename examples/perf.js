const assert = require('assert')
const { compile, compileTag, render, renderTag } = require('../lib/index')
const { render: mustacheRender } = require('mustache')

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

function micromustache_render(obj) {
  return render(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities[1]}}. foo is {{nested.foo}}.',
    obj
  )
}

function micromustache_renderTag(obj) {
  return renderTag(
    obj
  )`Hi, My name is ${'name'}! I am ${'age'} years old and live in ${'cities[1]'}. foo is ${'nested.foo'}.`
}

const micromustache_compileResolver = compile(
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities[1]}}. foo is {{nested.foo}}.'
)
function micromustache_compile(obj) {
  return micromustache_compileResolver.render(obj)
}

const micromustacheCompiledTagTestResolver = compileTag()`Hi, My name is ${'name'}! I am ${'age'} years old and live in ${'cities[1]'}. foo is ${'nested.foo'}.`
function micromustache_compileTag(obj) {
  return micromustacheCompiledTagTestResolver.render(obj)
}

function mustache_render(obj) {
  return mustacheRender(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.',
    obj
  )
}

function es_string_templates(obj) {
  return `Hi, My name is ${obj.name}! I am ${obj.age} years old and live in ${
    obj.cities[1]
  }. foo is ${obj.nested.foo}.`
}

for (const f of [
  micromustache_compile,
  micromustache_compileTag,
  micromustache_render,
  micromustache_renderTag,
  mustache_render,
  es_string_templates
]) {
  console.log('---', f.name)
  assert.equal(f(testObject), expectedOutput)
  console.time(f.name)
  for (let iteration = 0; iteration < iterations; iteration++) {
    f(testObject)
  }
  console.timeEnd(f.name)
}

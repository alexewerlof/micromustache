const assert = require('assert')
const { compile, render, renderTag, turboRender } = require('../lib/index')
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

function micromustacheRenderTest(obj) {
  return render(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities[1]}}. foo is {{nested.foo}}.',
    obj
  )
}

function micromustacheCompiledTest(obj) {
  micromustacheCompiledTest.resolver =
    micromustacheCompiledTest.resolver ||
    compile(
      'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities[1]}}. foo is {{nested.foo}}.'
    )
  return micromustacheCompiledTest.resolver.render(obj)
}

function micromustacheTurboRenderTest(obj) {
  return turboRender(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.',
    obj
  )
}

function micromustacheRenderTagTest(obj) {
  return renderTag(
    obj
  )`Hi, My name is ${'name'}! I am ${'age'} years old and live in ${'cities[1]'}. foo is ${'nested.foo'}.`
}

function mustacheRenderTest(obj) {
  return mustacheRender(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.',
    obj
  )
}

function stringTemplatesTest(obj) {
  return `Hi, My name is ${obj.name}! I am ${obj.age} years old and live in ${
    obj.cities[1]
  }. foo is ${obj.nested.foo}.`
}

for (const f of [
  mustacheRenderTest,
  micromustacheCompiledTest,
  micromustacheRenderTest,
  micromustacheTurboRenderTest,
  micromustacheRenderTagTest,
  stringTemplatesTest
]) {
  console.log('---', f.name)
  assert.equal(f(testObject), expectedOutput)
  console.time(f.name)
  for (let iteration = 0; iteration < iterations; iteration++) {
    f(testObject)
  }
  console.timeEnd(f.name)
}

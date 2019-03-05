const micromustache = require('../lib/index')

const renderer = micromustache.compile(
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.'
)

function compiled(obj) {
  return renderer.render(obj)
}

function render(obj) {
  return micromustache.render(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.',
    obj
  )
}

function renderTag(obj) {
  return micromustache.renderTag(
    obj
  )`Hi, My name is ${'name'}! I am ${'age'} years old and live in ${'cities.1'}. foo is ${'nested.foo'}.`
}

module.exports = {
  name: 'Micromustache',
  csp: true,
  cases: [compiled, render, renderTag]
}

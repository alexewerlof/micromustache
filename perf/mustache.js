const mustache = require('mustache')

const writer = new mustache.Writer()
const mustacheCompileTokens = writer.parse(
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.'
)

function compiled(obj) {
  return writer.renderTokens(mustacheCompileTokens, new mustache.Context(obj))
}

function render(obj) {
  mustache.clearCache()
  return mustache.render(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. foo is {{nested.foo}}.',
    obj
  )
}

module.exports = {
  name: 'Mustache',
  csp: false,
  cases: [compiled, render]
}

const mustache = require('mustache')

const writer = new mustache.Writer()
const mustacheCompileTokens = writer.parse(
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. In {{cities.1}}, foo is {{nested.foo}}. My favorite book is {{books.0.name}} by {{books.0.author}}. ({{books.0.year}}) is not defined.'
)

function compiled(obj) {
  return writer.renderTokens(mustacheCompileTokens, new mustache.Context(obj))
}

function render(obj) {
  mustache.clearCache()
  return mustache.render(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. In {{cities.1}}, foo is {{nested.foo}}. My favorite book is {{books.0.name}} by {{books.0.author}}. ({{books.0.year}}) is not defined.',
    obj
  )
}

module.exports = {
  name: 'Mustache',
  csp: true,
  cases: [compiled, render]
}

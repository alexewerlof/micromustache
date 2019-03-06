const micromustache = require('micromustache')

const renderer = micromustache.compile(
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. In {{cities.1}}, foo is {{nested.foo}}. My favorite book is {{books.0.name}} by {{books.0.author}}. ({{books.0.year}}) is not defined.'
)

function compiled(obj) {
  return renderer(obj)
}

function render(obj) {
  return micromustache.render(
    'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.1}}. In {{cities.1}}, foo is {{nested.foo}}. My favorite book is {{books.0.name}} by {{books.0.author}}. ({{books.0.year}}) is not defined.',
    obj
  )
}

module.exports = {
  name: 'Micromustache (deployed to NPM)',
  csp: true,
  cases: [compiled, render]
}

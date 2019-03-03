const template7 = require('template7')

// Compiles to javascript and uses eval which is not compatible with CSP environments
const renderer = template7.compile(
  // Note the array syntax!
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities[1]}}. foo is {{nested.foo}}.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'Template7',
  csp: false,
  cases: [compiled]
}

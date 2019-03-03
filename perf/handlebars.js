const handlebars = require('handlebars')

const renderer = handlebars.compile(
  // Note the array syntax!
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.[1]}}. foo is {{nested.foo}}.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'Handlebars',
  csp: false, // https://github.com/wycats/handlebars.js/issues/1443
  cases: [compiled]
}

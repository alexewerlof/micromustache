const template = require('lodash.template')

// Lodash is based on doT as well
const renderer = template(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'Lodash',
  csp: false, // You can use the CLI to precompile
  cases: [compiled]
}

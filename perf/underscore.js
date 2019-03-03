const { template } = require('underscore')

// underscore doesn't work in CSP environments
const renderer = template(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. foo is <%= nested.foo %>.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'Underscore',
  csp: false,
  cases: [compiled]
}

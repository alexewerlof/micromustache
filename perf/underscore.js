const { template } = require('underscore')

// underscore doesn't work in CSP environments
const renderer = template(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. In <%= cities[1] %>, foo is <%= nested.foo %>. My favorite book is <%= books[0].name %> by <%= books[0].author %>. (<%= books[0].year %>) is not defined.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'Underscore',
  csp: false,
  cases: [compiled]
}

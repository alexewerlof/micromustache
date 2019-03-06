const dot = require('dot')

// Compiles the template to a super optimized javascript code
const renderer = dot.template(
  'Hi, My name is {{=it.name}}! I am {{=it.age}} years old and live in {{=it.cities[1]}}. foo is {{=it.nested.foo}}.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'dot',
  csp: false,
  cases: [compiled]
}

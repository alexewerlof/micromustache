const dot = require('dot')

// Compiles the template to a super optimized javascript code
const renderer = dot.template(
  'Hi, My name is {{=it.name}}! I am {{=it.age}} years old and live in {{=it.cities[1]}}. In {{=it.cities[1]}}, foo is {{=it.nested.foo}}. My favorite book is {{=it.books[0].name}} by {{=it.books[0].author}}. ({{=it.books[0].year || ""}}) is not defined.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'dot',
  csp: false,
  cases: [compiled]
}

const handlebars = require('handlebars')

const renderer = handlebars.compile(
  // Note the array syntax!
  'Hi, My name is {{name}}! I am {{age}} years old and live in {{cities.[1]}}. In {{cities.[1]}}, foo is {{nested.foo}}. My favorite book is {{books.[0].name}} by {{books.[0].author}}. ({{books.[0].year}}) is not defined.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'Handlebars',
  csp: false, // https://github.com/wycats/handlebars.js/issues/1443
  cases: [compiled]
}

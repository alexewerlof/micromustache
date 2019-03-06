const ejs = require('ejs')

// Compiles to JavaScript functions
// How about templates having access to your file system? https://github.com/mde/ejs/issues/111
const renderer = ejs.compile(
  'Hi, My name is <%= name %>! I am <%= age %> years old and live in <%= cities[1] %>. In <%= cities[1] %>, foo is <%= nested.foo %>. My favorite book is <%= books[0].name %> by <%= books[0].author %>. (<%= books[0].year %>) is not defined.'
)

function compiled(obj) {
  return renderer(obj)
}

module.exports = {
  name: 'EJS',
  csp: false,
  cases: [compiled]
}

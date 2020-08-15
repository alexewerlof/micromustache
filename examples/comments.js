const { stringify, getPath, tokenize } = require('../')

function renderWithoutComments(template, scope, options) {
  const tokens = tokenize(template, options)
  const values = tokens.paths.map((path) => (/^\s*?!/.test(path) ? '' : getPath(scope, path)))
  return stringify(tokens.strings, values, options)
}

console.log(
  renderWithoutComments('This is not commented: "{{a}}" but this one is commented out: "{{!b}}"', {
    a: 'A',
    b: 'B',
  })
)

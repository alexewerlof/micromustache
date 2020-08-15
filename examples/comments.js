const { stringify, getPath, parseTemplate } = require('../')

function renderWithoutComments(template, scope, options) {
  const parsedTemplate = parseTemplate(template, options)
  const values = parsedTemplate.paths.map((path) =>
    /^\s*?!/.test(path) ? '' : getPath(scope, path)
  )
  return stringify(parsedTemplate.strings, values, options)
}

console.log(
  renderWithoutComments('This is not commented: "{{a}}" but this one is commented out: "{{!b}}"', {
    a: 'A',
    b: 'B',
  })
)

const { renderFn } = require('../')

function renderWithoutComments(template, scope, options) {
  return renderFn(template, (path) => (path.trimLeft().startsWith('!') ? '' : path), scope, options)
}

console.log(
  renderWithoutComments('This is not commented: "{{a}}" but this one is commented out: "{{!b}}"', {
    a: 'A',
    b: 'B',
  })
)

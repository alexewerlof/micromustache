const { parse, stringify, pathGet } = require('../')

function renderWithoutComments(template, scope, options) {
  const parsedTemplate = parse(template)
  return stringify(
    {
      strings: parsedTemplate.strings,
      subs: parsedTemplate.subs.map((sub) =>
        sub.trimLeft().startsWith('!') ? '' : pathGet(sub, scope)
      ),
    },
    scope,
    options
  )
}

console.log(
  renderWithoutComments('This is not commented: "{{a}}" but this one is commented out: "{{!b}}"', {
    a: 'A',
    b: 'B',
  })
)

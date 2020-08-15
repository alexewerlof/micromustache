const { render, parseTemplate, stringify, getPath } = require('../')

const scope = {
  names: ['Alex', 'Miranda', 'Jake'],
  idx: 2,
}

function doubleRender(template, scope) {
  // first pass
  const parsedTemplate = parseTemplate(template)
  // second pass
  function secondPass(path) {
    const result = render(path, scope, { tags: ['<', '>'] })
    console.log(`second pass got "${path} resulting to ${result}`)
    return getPath(scope, result, { validateRef: true })
  }

  return stringify(parsedTemplate.strings, parsedTemplate.paths.map(secondPass))
}

console.log(doubleRender('Hi {{names[<idx>]}}!', scope))

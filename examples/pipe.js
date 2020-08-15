const { getPath, parseTemplate, stringify } = require('../')

function compose(fnArr, initialValue) {
  return fnArr.reduce((input, fn) => fn(input), initialValue)
}

const pipes = {
  charCount(str) {
    return str.length
  },
  stars(n) {
    return '*'.repeat(n)
  },
}

function pipe(template, scope) {
  function applyPipe(path) {
    const [initialValuePath, ...pipeNames] = path.split('|')
    const value = getPath(scope, initialValuePath)
    if (pipeNames.length) {
      const fnArr = pipeNames.map((pipeName) => pipes[pipeName.trim()])
      return compose(fnArr, value)
    }
    return value
  }

  const parsedTemplate = parseTemplate(template)
  return stringify(parsedTemplate.strings, parsedTemplate.paths.map(applyPipe))
}

console.log(
  pipe("{{name}}'s password is {{password | charCount | stars}}!", {
    name: 'Kathrina',
    password: 'MonkeyIsland',
  })
)

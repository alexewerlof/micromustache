const { pathGet, renderFn } = require('../')

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
    // We are going to let this throw in case it cannot parse it
    const [initialValuePath, ...pipeNames] = path.split('|')
    const value = pathGet(scope, initialValuePath)
    if (pipeNames.length) {
      const fnArr = pipeNames.map((pipeName) => pipes[pipeName.trim()])
      return compose(fnArr, value)
    }
    return value
  }

  return renderFn(template, applyPipe)
}

console.log(
  pipe("{{name}}'s password is {{password | charCount | stars}}!", {
    name: 'Kathrina',
    password: 'MonkeyIsland',
  })
)

const { renderFn, get } = require('../')

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

const template = "{{name}}'s password is {{password | charCount | stars}}!"

function resolveFn(varName, scope) {
  const [vn, ...pipeNames] = varName.split('|')
  const value = get(scope, vn)
  if (pipeNames.length) {
    const fnArr = pipeNames.map((pipeName) => pipes[pipeName.trim()])
    return compose(fnArr, value)
  }
  return value
}

console.log(renderFn(template, resolveFn, { name: 'Kathrina', password: 'MonkeyIsland' }))

const { renderFn, get } = require('../dist/node')

const processors = {
  pow: (x, y) => x ** y
}

const scope = {
  numbers: {
    x: 13,
    y: 42
  }
}

const template = 'x²={{pow(numbers.x, 2)}} and y³={{pow(numbers["y"], 3)}}'

function resolveFn(varName, scope) {
  const matches = varName.match(/(.+)\(\s*(.+)\s*,\s*(.+)\s*\)/)
  if (matches) {
    const [, fnName, varName, secondParam] = matches
    return processors[fnName](get(scope, varName), secondParam)
  }
  return 'varName?!'
}

console.log(renderFn(template, resolveFn, scope))

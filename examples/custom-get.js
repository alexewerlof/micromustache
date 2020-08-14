const { renderFn, get } = require('../')

const processors = {
  pow: (a, b) => a ** b,
  add: (a, b) => a + b,
  abs: (a) => Math.abs(a),
}

const scope = {
  x: 13,
  y: 42,
  z: -10,
}

const template = 'x²={{pow(x, 2)}} and y³={{pow(y, 3)}} and |z|={{abs(z)}}'

function resolveFn(ref, scope) {
  const matches = ref.match(/(\w+)\(([^)]*)\)/)
  if (matches) {
    const [, fnName, params] = matches
    const paramNames = params.split(',').map((p) => p.trim())
    console.log(`Going to call ${fnName}(${paramNames})`)
    const paramVals = paramNames.map((paramName) => get(scope, paramName) || paramName)
    return processors[fnName](...paramVals)
  }
  return ''
}

console.log(renderFn(template, resolveFn, scope))

const { renderFn, get } = require('../dist/node')

console.log(
  renderFn(
    'This is not commented: "{{a}}" but this is: "{{!b}}"',
    (varName, scope) => (/\s*?!/.test() ? '' : get(scope, varName)),
    { a: 'hello', b: 'world' }
  )
)

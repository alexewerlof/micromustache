const { renderFn, get } = require('../')

console.log(
  renderFn(
    'This is not commented: "{{a}}" but this is: "{{!b}}"',
    (varName, scope) => (/^\s*?!/.test(varName) ? '' : get(scope, varName)),
    { a: 'hello', b: 'world' }
  )
)

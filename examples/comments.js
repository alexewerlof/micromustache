const { renderFn, get } = require('../')

console.log(
  renderFn(
    'This is not commented: "{{a}}" but this is: "{{!b}}"',
    (ref, scope) => (/^\s*?!/.test(ref) ? '' : get(scope, ref)),
    { a: 'hello', b: 'world' }
  )
)

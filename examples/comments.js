const { renderFn, get } = require('../')

console.log(
  renderFn(
    'This is not commented: "{{a}}" but this is: "{{!b}}"',
    (path, scope) => (/^\s*?!/.test(path) ? '' : get(scope, path)),
    { a: 'hello', b: 'world' }
  )
)

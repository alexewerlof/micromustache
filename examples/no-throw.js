const { render } = require('../dist/node')

try {
  console.log(
    'We claim that all varNames refer to properties that should exist: ',
    render(
      'There is no {{a.b.c}}!',
      {},
      {
        propsExist: true
      }
    )
  )
} catch (e) {
  console.log('That is why it throws:', e.message)
}

console.log('But without propsExist flag it is more forgiving:')

console.log(render('There is no {{a.b.c}}!', { a: 'foo' }))

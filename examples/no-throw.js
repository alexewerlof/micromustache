const { render } = require('../')

try {
  console.log(
    'We claim that all refs refer to properties that should exist: ',
    render(
      'There is no {{a.b.c}}!',
      {},
      {
        validatePath: true,
      }
    )
  )
} catch (e) {
  console.log('That is why it throws:', e.message)
}

console.log('But without validatePath flag it is more forgiving:')

console.log(render('There is no {{a.b.c}}!', { a: 'foo' }))

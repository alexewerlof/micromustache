const { render } = require('../')

try {
  console.log(
    'We claim that all paths refer to properties that should exist: ',
    render(
      'This path does not exist but it does not throw: "{{a.b.c}}"!',
      {},
      {
        validateRef: true,
      }
    )
  )
} catch (e) {
  console.log('That is why it throws:', e.message)
}

console.log('But without validateRef flag it is more forgiving:')

console.log(render('There is no {{a.b.c}}!', { a: 'foo' }))

const { render } = require('../dist/node')

try {
  console.log(
    'We claim that all varNames are valid: ',
    render(
      'There is no {{a.b.c}}!',
      {},
      {
        validVarName: true
      }
    )
  )
} catch (e) {
  console.log('That is why it throws:', e.message)
}

console.log('But without validVarName flag it is more forgiving:')

console.log(render('There is no {{a.b.c}}!'))

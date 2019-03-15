const { render } = require('../dist/node')

try {
  render('There is no {{a.b.c}}!')
} catch (e) {
  console.log('That is why it throws:', e.message)
}

console.log(
  'But with allowInvalidPaths: true it ignores them instead of throwing:'
)

console.log(
  render('There is no {{a.b.c}}!', undefined, {
    allowInvalidPaths: true
  })
)

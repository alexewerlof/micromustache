const { render } = require('../')

const scope1 = {
  foo: 'bar',
  baz: 'cux'
}

const scope2 = {
  foo: 'BAR',
  name: 'Kicki'
}

console.log(
  render('foo is {{foo}}, name is {{name}} and baz is {{baz}}', {
    ...scope1,
    ...scope2
  })
)

// This is a Node CommonJS file which tries to use the named CommonJS export as specified in the package.json
const { render } = require('..')

const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
  throw new Error(`The result does not match ${result}`)
}
console.log('✔', __filename)

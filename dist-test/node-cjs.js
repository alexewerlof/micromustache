const { render } = require('../.')

const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
    throw new Error(`The result does not match ${result}`)
}
console.log('CommonJS works just fine!')
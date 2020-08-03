// This is a Node CommonJS file which tries to use the CommonJS export as specified in the package.json
const mm = require('..')

const { render } = mm
const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
    throw new Error(`The result does not match ${result}`)
}
console.log('✔', __filename)

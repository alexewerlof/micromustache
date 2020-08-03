// This is a "normal" Node js file which tries to load the CommonJS version specifying its extension
const { render } = require('../dist/micromustache.cjs')

const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
    throw new Error(`The result does not match ${result}`)
}
console.log('✔', __filename)

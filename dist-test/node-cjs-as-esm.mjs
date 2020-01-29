import micromustache from '../dist/micromustache.js'

const { render } = micromustache
const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
    throw new Error(`The result does not match ${result}`)
}
console.log('✔', import.meta.url)

// This is a node ESM module which tries to access the CommonJS build for some reason!
import micromustache from '../dist/micromustache.cjs'

const { render } = micromustache
const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
    throw new Error(`The result does not match ${result}`)
}
console.log('✔', import.meta.url)

// Run this with node --es-module-specifier-resolution=node --experimental-modules node-esm.mjs 
// import micromustache from '../dist/micromustache.cjs'
import micromustache from '../dist/micromustache.cjs'

const { render } = micromustache
const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
    throw new Error(`The result does not match ${result}`)
}
console.log('We called the CommonJS version in Node like an ESM module!')
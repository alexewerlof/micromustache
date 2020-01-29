// Run this with node --es-module-specifier-resolution=node --experimental-modules node-esm.mjs 
import { render } from '../dist/micromustache.mjs'

const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
    throw new Error(`The result does not match ${result}`)
}
console.log('We called the ESM version in Node successfully!')

// This is a Node ESM file which tries to import the ESM version of the library
import { render } from '../dist/micromustache'

const result = render('Hello {{ name }}!', { name: 'Alex' })
if (result !== 'Hello Alex!') {
  throw new Error(`The result does not match ${result}`)
}
console.log('✔', import.meta.url)

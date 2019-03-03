const os = require('os')
const assert = require('assert')
const dot = require('./dot')
const ejs = require('./ejs')
const handlebars = require('./handlebars')
const lodash = require('./lodash')
const micromustache = require('./micromustache')
const mustache = require('./mustache')
const native = require('./native')
const nunjucks = require('./nunjucks')
const template7 = require('./template7')
const underscore = require('./underscore')

const NUM_ITERATIONS = 1e6

const scope = {
  name: 'Alex Ewerlöf',
  age: 37,
  nested: {
    foo: 'bar'
  },
  cities: ['Kiruna', 'Stockholm', 'Malmö']
}

const expectedOutput = `Hi, My name is ${scope.name}! I am ${scope.age} years old and live in ${
  scope.cities[1]
}. foo is ${scope.nested.foo}.`

function runCase(f) {
  console.time(f.name)
  for (let iteration = 0; iteration < NUM_ITERATIONS; iteration++) {
    // Assert that it is indeed returning the expected output
    if (iteration === 0) {
      assert.equal(f(scope), expectedOutput)
    }
    f(scope)
  }
  console.timeEnd(f.name)
}

console.info(`CPU: ${os.cpus()[0].model}`)
console.info(`RAM: ${(os.totalmem() / 2 ** 30).toFixed(1)} GiB`)
console.info(`OS: ${os.platform()}`)
console.info(`Iterations: ${NUM_ITERATIONS} times`)

for (const lib of [
  native,
  dot,
  template7,
  handlebars,
  micromustache,
  underscore,
  lodash,
  nunjucks,
  mustache,
  ejs
]) {
  console.log('\n---', lib.name, 'CSP safe:', lib.csp)
  lib.cases.forEach(f => runCase(f))
}

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

const NUM_ITERATIONS = 3e5

const scope = {
  name: 'Alex Ewerlöf',
  age: 37,
  nested: {
    foo: 'bar'
  },
  cities: ['Kiruna', 'Stockholm', 'Malmö']
}

function timeToStr([sec, nano]) {
  const ms = Math.round(sec / 1e3 + nano / 1e6)
  const icons = '🔹'.repeat(Math.ceil(ms / 100))
  return `(${ms} ms) ${icons}`
}

function cpuUsageToStr({ user, system }) {
  const unit = user + system
  const icons = '🔸'.repeat(Math.ceil(unit / 1e5))
  return icons
}

const expectedOutput = `Hi, My name is ${scope.name}! I am ${scope.age} years old and live in ${
  scope.cities[1]
}. foo is ${scope.nested.foo}.`

function runCase(f) {
  const startCpu = process.cpuUsage()
  const startTime = process.hrtime()
  for (let iteration = 0; iteration < NUM_ITERATIONS; iteration++) {
    // Assert that it is indeed returning the expected output
    if (iteration === 0) {
      assert.equal(f(scope), expectedOutput)
    }
    f(scope)
  }
  const endTime = process.hrtime(startTime)
  const endCpu = process.cpuUsage(startCpu)
  console.log(`${f.name}: ${timeToStr(endTime)}${cpuUsageToStr(endCpu)}`)
}

console.info(`CPU: ${os.cpus()[0].model}`)
console.info(`RAM: ${(os.totalmem() / 2 ** 30).toFixed(1)} GiB`)
console.info(`OS: ${os.platform()}`)
console.info(`Iterations: ${NUM_ITERATIONS} times`)

for (const lib of [
  native,
  micromustache,
  mustache,
  dot,
  template7,
  handlebars,
  underscore,
  lodash,
  nunjucks,
  ejs
]) {
  console.log('---')
  console.log(lib.csp ? '🔒' : '🔓', lib.name)
  lib.cases.forEach(f => runCase(f))
}

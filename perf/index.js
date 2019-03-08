const os = require('os')
const assert = require('assert')
const dot = require('./cases/dot')
const ejs = require('./cases/ejs')
const handlebars = require('./cases/handlebars')
const lodash = require('./cases/lodash')
const micromustache = require('./cases/micromustache')
const micromustacheNpm = require('./cases/micromustache-npm')
const mustache = require('./cases/mustache')
const native = require('./cases/native')
const nunjucks = require('./cases/nunjucks')
const template7 = require('./cases/template7')
const underscore = require('./cases/underscore')

const NUM_ITERATIONS = 3e5

const scope = {
  name: 'Alex Ewerlöf',
  age: 37,
  nested: {
    foo: 'bar'
  },
  cities: ['Kiruna', 'Stockholm', 'Malmö'],
  books: [
    {
      name: 'Brief Answers to Big Questions',
      author: 'Stephen Hawking'
    }
  ]
}

function timeToStr([sec, nano]) {
  const ms = Math.round(sec * 1e3 + nano / 1e6)
  const icons = '🔹'.repeat(Math.ceil(ms / 100))
  return `(${ms} ms) ${icons}`
}

function cpuUsageToStr({ user, system }) {
  const unit = user + system
  const icons = '🔸'.repeat(Math.ceil(unit / 1e5))
  return icons
}

/**
 * The performance template should have these features:
 * * simple 1-level keys
 * * undefined values
 * * array accessors
 * * nested object accessors
 * * repeated keys
 */
const expectedOutput = `Hi, My name is ${scope.name}! I am ${scope.age} years old and live in ${
  scope.cities[1]
}. In ${scope.cities[1]}, foo is ${scope.nested.foo}. My favorite book is ${
  scope.books[0].name
} by ${scope.books[0].author}. () is not defined.`

function runCase(f) {
  const startCpu = process.cpuUsage()
  const startTime = process.hrtime()
  for (let iteration = 0; iteration < NUM_ITERATIONS; iteration++) {
    // Assert that it is indeed returning the expected output
    if (iteration === 0) {
      if (f(scope) !== expectedOutput) {
        console.error(f.name, 'does not work correctly\n🔴', f(scope), '\n🔵', expectedOutput)
      }
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
  micromustacheNpm,
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

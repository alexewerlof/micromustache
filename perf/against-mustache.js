const micromustache = require('../')
const mustache = require('mustache')

const ITERATIONS = 10000
const LEN = 1000

const longScope = { a: 'fooooooooooooooooooooooooooooooooooooooooo' }
const longTemplate = '{{a}} and '.repeat(LEN)

const diverseScope = {}
for (let i = 0; i < LEN; i++) {
  diverseScope[`key_${i}`] = i + ' is ' + Math.random()
}
const diverseTemplate = Object.keys(diverseScope)
  .map((key) => ` {{${key}}} `)
  .join('and')

const deepScope = {}
const indices = []
for (let i = 0, currObj = deepScope; i < LEN; i++) {
  currObj[i] = {}
  currObj = currObj[i]
  indices.push(i)
}
const deepTemplate = '{{' + indices.join('.') + '}}'

const hrtime2ms = ([sec, nano]) => sec * 1e3 + nano / 1e6
const x = (a, b) => (a / b).toFixed(1) + 'x ' + (a / b < 1 ? 'slower🔻' : 'faster🔺')

function compare(f1, f2) {
  const f1name = f1.name
  const f2name = f2.name

  console.log(`Comparing ${f1name}() to ${f2name}() for ${ITERATIONS} iterations...`)
  let start = process.hrtime()
  for (let i = 0; i < ITERATIONS; i++) {
    f1()
  }
  const f1duration = hrtime2ms(process.hrtime(start))
  start = process.hrtime()
  for (let i = 0; i < ITERATIONS; i++) {
    f2()
  }
  const f2duration = hrtime2ms(process.hrtime(start))

  console.log(`${f1name}: ${f1duration}ms (${x(f2duration, f1duration)})`)
  console.log(`${f2name}: ${f2duration}ms (${x(f1duration, f2duration)})`)
}

function micromustacheLong() {
  return micromustache.render(longTemplate, longScope)
}

function mustacheLong() {
  return mustache.render(longTemplate, longScope)
}

function micromustacheDiverse() {
  return micromustache.render(diverseTemplate, diverseScope)
}

function mustacheDiverse() {
  return mustache.render(diverseTemplate, diverseScope)
}

function micromustacheDeep() {
  return micromustache.render(deepTemplate, deepScope, { depth: LEN, maxVarNameLength: 999999 })
}

function mustacheDeep() {
  return mustache.render(deepTemplate, deepScope)
}

compare(micromustacheLong, mustacheLong)
compare(micromustacheDiverse, mustacheDiverse)
compare(micromustacheDeep, mustacheDeep)

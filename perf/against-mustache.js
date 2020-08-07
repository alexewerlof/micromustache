const micromustache = require('../')
const mustache = require('mustache')

/*
 * Notes to keep in mind:
 * 1. These examples are not realistic. In practice you won't use these extremes.
 * 2. To Mustache.js defense, it does much more than interpolation so it's not an apple to apple...
 */

const ITERATIONS = 10000

const hrtime2ms = ([sec, nano]) => sec * 1e3 + nano / 1e6
function x(a, b) {
  const ratio = b / a
  if (ratio < 1) {
    return ''
  }

  let ret = '🔥 ('
  ret += ratio < 2 ? (((b - a) * 100) / a).toFixed(0) + '%' : ratio.toFixed(1) + 'x'
  ret += ' faster)'
  return ret
}
const ms = (a) => Math.round(a) + 'ms'

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

  console.log(`${f1name}: ${ms(f1duration)} ${x(f1duration, f2duration)}`)
  console.log(`${f2name}: ${ms(f2duration)} ${x(f2duration, f1duration)}`)
}

const LEN = 1000

const longVarName = 'x'.repeat(LEN)
const longScope = { [longVarName]: 'y'.repeat(LEN) }
const longTemplate = '{{' + longVarName + '}} and '.repeat(LEN)

function micromustacheLong() {
  return micromustache.render(longTemplate, longScope, { maxVarNameLength: 999999 })
}

function mustacheLong() {
  return mustache.render(longTemplate, longScope)
}

const diverseScope = {}
for (let i = 0; i < LEN; i++) {
  diverseScope[`key_${i}`] = i + ' is ' + Math.random()
}
const diverseTemplate = Object.keys(diverseScope)
  .map((key) => `{{${key}}}`)
  .join(' ')

function micromustacheDiverse() {
  return micromustache.render(diverseTemplate, diverseScope)
}

function mustacheDiverse() {
  return mustache.render(diverseTemplate, diverseScope)
}

const deepScope = {}
const indices = []
for (let i = 0, currObj = deepScope; i < LEN; i++) {
  // Generate random string like '4ea3f82979'
  const index = Math.random().toString(16).substring(2, 12)
  const newObj = {}
  currObj[index] = newObj
  currObj = newObj
  indices.push(index)
}
const deepTemplate = '{{' + indices.join('.') + '}}'

function micromustacheDeep() {
  return micromustache.render(deepTemplate, deepScope, { depth: LEN, maxVarNameLength: 999999 })
}

function mustacheDeep() {
  return mustache.render(deepTemplate, deepScope)
}

compare(micromustacheLong, mustacheLong)
compare(micromustacheDiverse, mustacheDiverse)
compare(micromustacheDeep, mustacheDeep)

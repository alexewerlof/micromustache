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

  console.log(`1. ${f1name}: ${ms(f1duration)} ${x(f1duration, f2duration)}`)
  console.log(`2. ${f2name}: ${ms(f2duration)} ${x(f2duration, f1duration)}`)
}

const LEN = 100

const longPath = 'x'.repeat(LEN)
const longVal = 'y'.repeat(LEN)
const longScope = { [longPath]: longVal }
const longPathTemplate = '{{' + longPath + '}}'

function micromustacheLongPath() {
  return micromustache.render(longPathTemplate, longScope, { maxPathLen: 999999 })
}

function mustacheLongPath() {
  return mustache.render(longPathTemplate, longScope)
}

const longTmplPath = 'w'
const longTmplScope = {
  [longTmplPath]: 'j',
}
const longTmplTemplate = ('{{' + longTmplPath + '}} and ').repeat(LEN)

function micromustacheLongTmpl() {
  return micromustache.render(longTmplTemplate, longTmplScope, { maxPathLen: 999999 })
}

function mustacheLongTmpl() {
  return mustache.render(longTmplTemplate, longScope)
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
  return micromustache.render(deepTemplate, deepScope, { maxRefDepth: LEN, maxPathLen: 999999 })
}

function mustacheDeep() {
  return mustache.render(deepTemplate, deepScope)
}

const allScope = { ...longScope, ...longTmplScope, ...diverseScope, ...deepScope }
const allTemplate = longPathTemplate + longTmplTemplate + diverseTemplate + deepTemplate

function micromustacheAll() {
  return micromustache.render(allTemplate, allScope, { maxRefDepth: LEN, maxPathLen: 999999 })
}

function mustacheAll() {
  return mustache.render(allTemplate, allScope)
}

compare(micromustacheLongPath, mustacheLongPath)
compare(micromustacheLongTmpl, mustacheLongTmpl)
compare(micromustacheDiverse, mustacheDiverse)
compare(micromustacheDeep, mustacheDeep)
compare(micromustacheAll, mustacheAll)

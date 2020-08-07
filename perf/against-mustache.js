const micromustache = require('../')
const mustache = require('mustache')

const LEN = 270

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

const timestamp2ms = ([sec, nano]) => sec * 1e3 + nano / 1e6

function compare(name, f1, f2, ...args) {
  const iterations = 10000
  console.log(`Comparing ${name} for ${iterations} iterations...`)
  let start = process.hrtime()
  for (let i = 0; i < iterations; i++) {
    f1(...args)
  }
  const f1duration = timestamp2ms(process.hrtime(start))
  start = process.hrtime()
  for (let i = 0; i < iterations; i++) {
    f2(...args)
  }
  const f2duration = timestamp2ms(process.hrtime(start))
  console.log(`⏲   micromustache: ${f1duration}ms\tMustache.js: ${f2duration}ms`)
  if (f1duration < f2duration) {
    console.log(`👍  micromustache is ${(f2duration / f1duration).toFixed(1)}x faster`)
  } else {
    console.log(`👎  Mustache.JS is ${(f1duration / f2duration).toFixed(1)}x faster`)
  }
}

compare('long', micromustache.render, mustache.render, longTemplate, longScope)
compare('diverse', micromustache.render, mustache.render, diverseTemplate, diverseScope)
compare('deep', micromustache.render, mustache.render, deepTemplate, deepScope)

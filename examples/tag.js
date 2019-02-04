const { toTemplate, toTemplateOpt } = require('../lib/index')

const what = 'name'
const yo = 'YO'
const mo = 'MO'
console.log(toTemplate`Hi! My name is ${what}${yo}. How are you?${mo}`)
console.log(
  toTemplateOpt({
    openSymbol: '<',
    closeSymbol: '>'
  })`Hi! My name is ${what}${yo}. How are you?${mo}`
)

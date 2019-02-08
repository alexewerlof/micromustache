const { toTemplate, toTemplateOpt } = require('../lib/index')

const what = 'name'
const yo = 'YO'
const mo = 'MO'
console.log(toTemplate`Hi! My name is ${what}${yo}. How are you?${mo}`)
console.log(toTemplateOpt('<')`Hi! My name is ${what}${yo}. How are you?${mo}`)

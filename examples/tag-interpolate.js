const { compileTag, renderTag } = require('../lib/index')

const person = {
  firstName: 'Alex',
  lastName: 'Ewerlöf',
  nationality: 'Swedish'
}

console.log(
  compileTag()`Hi! My name is ${'firstName'} ${'lastName'} and I am ${'nationality'}`.render(person)
)

console.log(
  renderTag(person)`Hi! My name is ${'firstName'} ${'lastName'} and I am ${'nationality'}`
)

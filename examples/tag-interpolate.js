const { compileTag } = require('../lib/index')

const person = {
  firstName: 'Alex',
  lastName: 'Ewerlöf',
  nationality: 'Swedish'
}

console.log(
  compileTag()`Hi! My name is ${'firstName'} ${'lastName'} and I am ${'nationality'}`.render(person)
)

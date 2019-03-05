const { renderTag } = require('../lib/index')

const person = {
  firstName: 'Alex',
  lastName: 'Ewerlöf',
  nationality: 'Swedish'
}

console.log(
  renderTag(person)`Hi! My name is ${'firstName'} ${'lastName'} and I am ${'nationality'}`
)

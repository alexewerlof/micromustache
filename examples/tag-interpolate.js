const person = {
  firstName: 'Alex',
  lastName: 'Ewerlöf',
  nationality: 'Swedish'
}

console.log(
  tagInterpolation(person)`Hi! My name is ${'firstName'} ${'lastName'} and I am ${'nationality'}`
)

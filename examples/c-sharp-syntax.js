// Inspired by:
// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/interpolated

const { render } = require('../dist/node')

const csDelimiters = {
  tags: ['{', '}']
}
const name = 'Mark'
const date = new Date()

// Composite formatting:
console.log(
  render(
    'Hello, {0}! Weekday is {1} and the day in the month is {2} now.',
    [name, date.getDay() + 1, date.getDate()],
    csDelimiters
  )
)
// String interpolation:
console.log(
  render(
    'Hello, {name}! It is {d} now.',
    { name, d: date.getDate() },
    csDelimiters
  )
)

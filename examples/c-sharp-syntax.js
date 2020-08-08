// Inspired by:
// https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/interpolated

const { render } = require('../')

const csDelimiters = {
  tags: ['{', '}'],
}
const name = 'Mark'
const date = new Date()

function csRender(template, ...variables) {
  return render(template, variables, { tags: ['{', '}'] })
}

function $(scope) {
  return (strings) => {
    return render(strings[0], scope, { tags: ['{', '}'] })
  }
}

// Composite formatting:
console.log(
  render(
    'Hello, {0}! Weekday is {1} and the day in the month is {2} now.',
    [name, date.getDay() + 1, date.getDate()],
    csDelimiters
  )
)
// Dedicated syntax sugar function
console.log(
  csRender(
    'Hello, {0}! Weekday is {1} and the day in the month is {2} now.',
    name,
    date.getDay() + 1,
    date.getDate()
  )
)
// String interpolation:
console.log(render('Hello, {name}! It is {d} now.', { name, d: date.getDate() }, csDelimiters))
// $ syntax even more familiar for C# devs
console.log($({ name, d: date.getDate() })`Hello, {name}! It is {d} now.`)

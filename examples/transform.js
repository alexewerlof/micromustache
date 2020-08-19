/**
 * This example reverses the substitutes and converts them to upper case
 */
const { transform, stringify, parse } = require('../')

const parsedTemplate = parse('Hello {{Jimbo}}! This is going to be your {{airport}}!')

console.log(
  stringify(
    transform(
      transform(parsedTemplate, (sub) => sub.split('').reverse().join('')),
      (sub) => sub.toUpperCase()
    )
  )
)

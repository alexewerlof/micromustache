const { tokenize, stringify } = require('../')

function beforeLookup(path) {
  switch (path.toLowerCase()) {
    case 'one':
      return 1
    case 'two':
      return 2
    case 'three':
      return 3
    default:
      return 0
  }
}

function afterLookup(path) {
  return '*'.repeat(path)
}

console.log(
  'This is some semi-advanced processing here.',
  'We process the paths to map them to numbers.',
  'Then treat those numbers as array indexes to some scope.',
  'Then we replace those variables with a few stars',
  'the number of which correspond to the value of the elements in the array.'
)

function transform(template, scope) {
  function transformChain(path) {
    const arrIndex = beforeLookup(path)
    const numStars = scope[arrIndex]
    return afterLookup(numStars)
  }

  const tokens = tokenize(template)
  return stringify(tokens.strings, tokens.paths.map(transformChain))
}
const arr = [0, 10, 20, 30]
console.log(transform('zero={{Zero}}\nOne={{one}}\nTwo={{two}}\nThree={{three}}', arr))

/* output:
zero=
One=**********
Two=********************
Three=******************************
*/

const { parse, stringify, pathGet } = require('../')

console.log(
  [
    'We process the paths to map them to numbers.',
    'Then treat those numbers as array indexes to some scope.',
    'Then we replace those variables with a few stars',
    'the number of which correspond to the value of the elements in the array.',
  ].join(' ')
)

function convertStringToNumber(str) {
  switch (str.toLowerCase()) {
    case 'one':
      return '1'
    case 'two':
      return '2'
    case 'three':
      return '3'
    default:
      return '0'
  }
}

function multiLevelTransformation(template, scope) {
  console.log('Parsing the initial string')
  const { strings, subs } = parse(template)
  return stringify({
    strings,
    subs: subs
      .map(convertStringToNumber)
      .map((n) => pathGet(n, scope))
      .map((val) => '*'.repeat(val)),
  })
}

const arr = [0, 10, 20, 30]
console.log(
  multiLevelTransformation('zero={{Zero}}\nOne={{one}}\nTwo={{two}}\nThree={{three}}', arr)
)

/* output:
zero=
One=*
Two=**
Three=***
*/

const { renderFn } = require('../')

function beforeLookup(ref) {
  switch (ref.toLowerCase()) {
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

function afterLookup(ref) {
  return '*'.repeat(ref)
}

console.log(
  'This is some semi-advanced processing here.',
  'We process the refs to map them to numbers.',
  'Then treat those numbers as array indexes to some scope.',
  'Then we replace those variables with a few stars',
  'the number of which correspond to the value of the elements in the array.'
)

const arr = [0, 10, 20, 30]
console.log(
  renderFn(
    'zero={{Zero}}\nOne={{one}}\nTwo={{two}}\nThree={{three}}',
    (ref, scope) => {
      const arrIndex = beforeLookup(ref)
      const numStars = scope[arrIndex]
      return afterLookup(numStars)
    },
    arr
  )
)

/* output:
zero=
One=**********
Two=********************
Three=******************************
*/

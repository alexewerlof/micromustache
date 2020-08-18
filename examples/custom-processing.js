const { parse, transform, stringify } = require('../')

console.log(
  'This is some semi-advanced processing here.',
  'We process the paths to map them to numbers.',
  'Then treat those numbers as array indexes to some scope.',
  'Then we replace those variables with a few stars',
  'the number of which correspond to the value of the elements in the array.'
)

function multiLevelTransformation(template, scope) {
  function transformChain(path) {
    const arrIndex = beforeLookup(path)
    const numStars = scope[arrIndex]
    return afterLookup(numStars)
  }

  console.log('Parsing the initial string')
  const parsedTemplate = parse(template)

  console.log('Converting paths to lower case')
  const lowerCasePaths = transform(parsedTemplate, (path) => path.toLowerCase())

  console.log('Converting paths to numbers')
  const numericPaths = transform(lowerCasePaths, (str) => {
    switch (str.toLowerCase()) {
      case 'one':
        return 1
      case 'two':
        return 2
      case 'three':
        return 3
      default:
        return 0
    }
  })

  // Repeating stars as many times as the number in the path indicates
  const starsRepeater = transform(numericPaths, (n) => '*'.repeat(n))

  // Finally let's interpolate paths with constant strings in the template
  return stringify(starsRepeater)
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

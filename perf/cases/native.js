function templateLiteral(obj) {
  return `Hi, My name is ${obj.name}! I am ${obj.age} years old and live in ${obj.cities[1]}. In ${
    obj.cities[1]
  }, foo is ${obj.nested.foo}. My favorite book is ${obj.books[0].name} by ${
    obj.books[0].author
  }. (${obj.books[0].year || ''}) is not defined.`
}

function strConcat(obj) {
  return (
    'Hi, My name is ' +
    obj.name +
    '! I am ' +
    obj.age +
    ' years old and live in ' +
    obj.cities[1] +
    '. In ' +
    obj.cities[1] +
    ', foo is ' +
    obj.nested.foo +
    '. My favorite book is ' +
    obj.books[0].name +
    ' by ' +
    obj.books[0].author +
    '. (' +
    (obj.books[0].year || '') +
    ') is not defined.'
  )
}

function strConcatMultiline(obj) {
  let ret = ''
  ret += 'Hi, My name is '
  ret += obj.name
  ret += '! I am '
  ret += obj.age
  ret += ' years old and live in '
  ret += obj.cities[1]
  ret += '. In '
  ret += obj.cities[1]
  ret += ', foo is '
  ret += obj.nested.foo
  ret += '. My favorite book is '
  ret += obj.books[0].name
  ret += ' by '
  ret += obj.books[0].author
  ret += '. ('
  ret += obj.books[0].year || ''
  ret += ') is not defined.'
  return ret
}

function strJoin(obj) {
  const ret = ['Hi, My name is ']
  ret.push(obj.name)
  ret.push('! I am ')
  ret.push(obj.age)
  ret.push(' years old and live in ')
  ret.push(obj.cities[1])
  ret.push('. In ')
  ret.push(obj.cities[1])
  ret.push(', foo is ')
  ret.push(obj.nested.foo)
  ret.push('. My favorite book is ')
  ret.push(obj.books[0].name)
  ret.push(' by ')
  ret.push(obj.books[0].author)
  ret.push('. (')
  ret.push(obj.books[0].year || '')
  ret.push(') is not defined.')
  return ret.join('')
}

function strJoinPreAllocated(obj) {
  const ret = new Array(9)
  ret[0] = 'Hi, My name is '
  ret[1] = obj.name
  ret[2] = '! I am '
  ret[3] = obj.age
  ret[4] = ' years old and live in '
  ret[5] = obj.cities[1]
  ret[6] = '. In '
  ret[7] = obj.cities[1]
  ret[8] = ', foo is '
  ret[9] = obj.nested.foo
  ret[10] = '. My favorite book is '
  ret[11] = obj.books[0].name
  ret[12] = ' by '
  ret[13] = obj.books[0].author
  ret[14] = '. ('
  ret[15] = obj.books[0].year || ''
  ret[16] = ') is not defined.'
  return ret.join('')
}

const strJoinPreInterpolatedCache = new Array(17)
strJoinPreInterpolatedCache[0] = 'Hi, My name is '
strJoinPreInterpolatedCache[2] = '! I am '
strJoinPreInterpolatedCache[4] = ' years old and live in '
strJoinPreInterpolatedCache[6] = '. In '
strJoinPreInterpolatedCache[8] = ', foo is '
strJoinPreInterpolatedCache[10] = '. My favorite book is '
strJoinPreInterpolatedCache[12] = ' by '
strJoinPreInterpolatedCache[14] = '. ('
strJoinPreInterpolatedCache[16] = ') is not defined.'

function strJoinPreInterpolated(obj) {
  strJoinPreInterpolatedCache[1] = obj.name
  strJoinPreInterpolatedCache[3] = obj.age
  strJoinPreInterpolatedCache[5] = obj.cities[1]
  strJoinPreInterpolatedCache[7] = obj.cities[1]
  strJoinPreInterpolatedCache[9] = obj.nested.foo
  strJoinPreInterpolatedCache[11] = obj.books[0].name
  strJoinPreInterpolatedCache[13] = obj.books[0].author
  strJoinPreInterpolatedCache[15] = obj.books[0].year || ''
  return strJoinPreInterpolatedCache.join('')
}

const strConcatPreInterpolatedStrings = new Array(9)
strConcatPreInterpolatedStrings[0] = 'Hi, My name is '
strConcatPreInterpolatedStrings[1] = '! I am '
strConcatPreInterpolatedStrings[2] = ' years old and live in '
strConcatPreInterpolatedStrings[3] = '. In '
strConcatPreInterpolatedStrings[4] = ', foo is '
strConcatPreInterpolatedStrings[5] = '. My favorite book is '
strConcatPreInterpolatedStrings[6] = ' by '
strConcatPreInterpolatedStrings[7] = '. ('
strConcatPreInterpolatedStrings[8] = ') is not defined.'
const strConcatPreInterpolatedValues = new Array(8)

function strConcatPreInterpolated(obj) {
  strConcatPreInterpolatedValues[0] = obj.name
  strConcatPreInterpolatedValues[1] = obj.age
  strConcatPreInterpolatedValues[2] = obj.cities[1]
  strConcatPreInterpolatedValues[3] = obj.cities[1]
  strConcatPreInterpolatedValues[4] = obj.nested.foo
  strConcatPreInterpolatedValues[5] = obj.books[0].name
  strConcatPreInterpolatedValues[6] = obj.books[0].author
  strConcatPreInterpolatedValues[7] = obj.books[0].year || ''

  let ret = ''
  const valuesLength = strConcatPreInterpolatedValues.length
  for (let i = 0; i < valuesLength; i++) {
    ret += strConcatPreInterpolatedStrings[i]
    ret += strConcatPreInterpolatedValues[i]
  }
  ret += strConcatPreInterpolatedStrings[valuesLength]
  return ret
}

module.exports = {
  name: '(Native)',
  csp: true,
  cases: [
    templateLiteral,
    strConcat,
    strConcatMultiline,
    strJoin,
    strJoinPreAllocated,
    strJoinPreInterpolated,
    strConcatPreInterpolated
  ]
}

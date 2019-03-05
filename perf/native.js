function templateLiteral(obj) {
  return `Hi, My name is ${obj.name}! I am ${obj.age} years old and live in ${
    obj.cities[1]
  }. foo is ${obj.nested.foo}.`
}

function strConcat(obj) {
  return (
    'Hi, My name is ' +
    obj.name +
    '! I am ' +
    obj.age +
    ' years old and live in ' +
    obj.cities[1] +
    '. foo is ' +
    obj.nested.foo +
    '.'
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
  ret += '. foo is '
  ret += obj.nested.foo
  ret += '.'
  return ret
}

function strJoin(obj) {
  const ret = ['Hi, My name is ']
  ret.push(obj.name)
  ret.push('! I am ')
  ret.push(obj.age)
  ret.push(' years old and live in ')
  ret.push(obj.cities[1])
  ret.push('. foo is ')
  ret.push(obj.nested.foo)
  ret.push('.')
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
  ret[6] = '. foo is '
  ret[7] = obj.nested.foo
  ret[8] = '.'
  return ret.join('')
}

const strJoinPreInterpolatedCache = new Array(9)
strJoinPreInterpolatedCache[0] = 'Hi, My name is '
strJoinPreInterpolatedCache[2] = '! I am '
strJoinPreInterpolatedCache[4] = ' years old and live in '
strJoinPreInterpolatedCache[6] = '. foo is '
strJoinPreInterpolatedCache[8] = '.'

function strJoinPreInterpolated(obj) {
  strJoinPreInterpolatedCache[1] = obj.name
  strJoinPreInterpolatedCache[3] = obj.age
  strJoinPreInterpolatedCache[5] = obj.cities[1]
  strJoinPreInterpolatedCache[7] = obj.nested.foo
  return strJoinPreInterpolatedCache.join('')
}

const strConcatPreInterpolatedStrings = new Array(5)
strConcatPreInterpolatedStrings[0] = 'Hi, My name is '
strConcatPreInterpolatedStrings[1] = '! I am '
strConcatPreInterpolatedStrings[2] = ' years old and live in '
strConcatPreInterpolatedStrings[3] = '. foo is '
strConcatPreInterpolatedStrings[4] = '.'
const strConcatPreInterpolatedValues = new Array(4)

function strConcatPreInterpolated(obj) {
  strConcatPreInterpolatedValues[0] = obj.name
  strConcatPreInterpolatedValues[1] = obj.age
  strConcatPreInterpolatedValues[2] = obj.cities[1]
  strConcatPreInterpolatedValues[3] = obj.nested.foo

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

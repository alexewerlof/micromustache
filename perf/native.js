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

module.exports = {
  name: '(Native)',
  csp: true,
  cases: [templateLiteral, strConcat, strJoin]
}

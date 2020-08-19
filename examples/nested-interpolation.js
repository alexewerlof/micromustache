const { render } = require('../')

function doubleRender(template, scope) {
  // first pass
  const template1 = render(template, scope, { tags: ['<', '>'] })
  // Second pass
  const template2 = render(template1, scope)
  console.dir({ template1, template2 })
  return template2
}

const scope = {
  names: ['Alex', 'Miranda', 'Jake'],
  idx: 2,
}

console.log(doubleRender('Hi {{names[<idx>]}}!', scope))

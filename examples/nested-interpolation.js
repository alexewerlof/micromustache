const { render, parseTemplate, renderFn, pathGet } = require('../')

function doubleRender(template, scope) {
  // first pass
  return renderFn(template, (path) => {
    // Second pass
    const result = render(path, scope, { tags: ['<', '>'] })
    console.log(`second pass got "${path} resulting to ${result}`)
    return pathGet(result, scope, { validateRef: true })
  })
}

const scope = {
  names: ['Alex', 'Miranda', 'Jake'],
  idx: 2,
}

console.log(doubleRender('Hi {{names[<idx>]}}!', scope))

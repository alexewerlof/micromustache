const { render, renderFn, get } = require('../')

const scope = {
  names: ['Alex', 'Miranda', 'Jake'],
  idx: 2,
}

console.log(
  renderFn(
    'Hi {{names[<idx>]}}!',
    function resolveFn(path, scope) {
      // we'll get names[<idx>] here
      const interpolateAngleBrackets = render(path, scope, { tags: ['<', '>'] })
      // Now we have names[2] which we can feed into the render function again
      return render('{{' + interpolateAngleBrackets + '}}', scope)
    },
    scope
  )
)

const { stringify, transform, parseTemplate, pathGet } = require('../')

const functions = {
  rev: (a) => a.split('').reverse().join(''),
  up: (a) => a.toUpperCase(),
  low: (a) => a.toLowerCase(),
}

const scope = {
  firstName: 'Alex',
  lastName: 'Ewerlöf',
  company: 'Simpsons',
}

const template = '{{up(lastName)}}, {{low(firstName)}} works for {{rev(company)}} {{wat}}'

function applyFunctions(functions, template, scope) {
  function resolvePathToFunctionResult(path) {
    const matches = path.match(/(\w+)\(([^)]*)\)/)

    if (matches) {
      const [, fnName, argPath] = matches
      console.log(`Going to call ${fnName}(${argPath})`)
      const argVal = pathGet(scope, argPath, {
        // Just so we throw for non-existing paths in the template
        validateRef: true,
      })
      // The result of this call will be used to substitute the path in the template
      return functions[fnName](argVal)
    }

    // If we can't parse a path to "function(param)" format, we return it.
    // We could throw instead to be strict.
    return `"${path}"???`
  }

  // We could use renderFn() as well, but let's demonstrate how parsing path and transform works
  const parsedTemplate = transform(parseTemplate(template), resolvePathToFunctionResult)
  return stringify(parsedTemplate)
}

console.log(applyFunctions(functions, template, scope))

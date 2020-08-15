const { stringify, parseTemplate, getPath } = require('../')

const processors = {
  rev: (a) => a.split('').reverse().join(''),
  up: (a) => a.toUpperCase(),
  low: (a) => a.toLowerCase(),
}

const scope = {
  firstName: 'Alex',
  lastName: 'Ewerlöf',
  company: 'Simpsons',
}

const template = '{{up(lastName)}}, {{low(firstName)}} works for{{rev(company)}}'

function callFunctions(template, scope) {
  function pow(path) {
    const matches = path.match(/(\w+)\(([^)]*)\)/)
    if (matches) {
      const [, fnName, paramName] = matches
      console.log(`Going to call ${fnName}(${paramName})`)
      const paramVal = getPath(scope, paramName, {
        // JUst so we throw for non-existing paths in the template
        validateRef: true,
      })
      return processors[fnName](paramVal)
    }
    return '---'
  }

  const parsedTemplate = parseTemplate(template)
  return stringify(parsedTemplate.strings, parsedTemplate.paths.map(pow))
}

console.log(callFunctions(template, scope))

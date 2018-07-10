const { defaultResolver } = require('./resolve');

const _defaultToString = Object.prototype.toString;
/**
 * @callback ResolverFn
 * @param {string} varName - variable name before being parsed.
 *        For example: {a.b.c} ->  'a.b.c', {  x  } -> 'x'
 * @param {Object} view - the view object that was passed to .render() function
 * @returns {string|number|boolean|Object|undefined} the value to be
 *        interpolated. If the function returns undefined, the value resolution
 *        algorithm will go ahead with the default behaviour (resolving the
 *        variable name from the provided object).
 */

/**
 * @callback Compiler
 *
 * @param {Object} [view={}] - An optional object containing values for
 *        every variable names that is used in the template. If it's omitted,
 *        it'll be assumed an empty object.
 * @returns {string} - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */

function valueToString(value) {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return value;
    case 'object':
      if (value === null) {
        return ''
      }
      if (typeof value.toString === 'function' && value.toString !== _defaultToString) {
        return value.toString();
      }
      try {
        // null is an object but is falsy. Swallow it.
        return JSON.stringify(value);
      } catch (jsonError) {
        return '{...}';
      }
    default:
      // Anything else will be replaced with an empty string
      // For example: undefined, Symbol, etc.
      return '';
  }
}

const openSymbol = '{{'
const closeSymbol = '}}'

function lazy(varName) {
  return (evaluate) => valueToString(evaluate(varName))
}

/**
 * Tokenize the template string and return an array of strings and
 * functions ready for the compiler to go through them.
 *
 * @param {string} template - the template
 * @returns {string} - the resulting string
 */
function tokenize(template) {
  let openIndex, closeIndex, before, varname
  const openSymbolLength = openSymbol.length
  const closeSymbolLength = closeSymbol.length
  const ret = []
  let currentIndex = -openSymbolLength;
  while (currentIndex < template.length) {
    openIndex = template.indexOf(openSymbol, currentIndex)
    if (openIndex === -1) {
      break;
    }
    closeIndex = template.indexOf(closeSymbol, openIndex)
    if (closeIndex === -1) {
      break;
    }
    varname = template.substring(openIndex + openSymbolLength, closeIndex).trim()
    closeIndex += closeSymbolLength
    before = template.substring(currentIndex, openIndex)
    currentIndex = closeIndex

    if (before !== '') {
      ret.push(before)
    }
    ret.push(lazy(varname))
  }
  if (closeIndex != template.length) {
    ret.push(template.substring(closeIndex))
  }
  return ret
}

function inject(tokens, resolver) {
  return tokens.map(token => typeof token === 'function' ? token(resolver) : token).join('')
}

/**
 * This function makes repeated calls shorter by returning a compiler function
 * for a particular template that accepts view and returnes the rendered string.
 *
 * It doesn't make the code faster since the compiler still uses render
 * internally.
 *
 * @param {string} template - same as the template parameter to .render()
 * @param {GeneralValueFn} [resolver] - same as the parameter to .render()
 * @returns {Compiler} - a function that accepts a view object and returns a
 *        rendered template string template
 */
function compile(template, resolver = defaultResolver) {
  // don't touch the template if it is not a string
  if (typeof template !== 'string') {
    return () => template;
  }
  // Create and return a function that will always apply this template
  // and resolver under the hood
  const tokens = tokenize(template)
  return function renderer(view) {
    return inject(tokens, (varName) => resolver(varName, view))
  }
}

module.exports = compile;

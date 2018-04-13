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

function _valueToString (value) {
  switch (typeof value) {
  case 'string':
  case 'number':
  case 'boolean':
    return value;
  case 'object':
    try {
      // null is an object but is falsy. Swallow it.
      return value === null ? '' : JSON.stringify(value);
    } catch (jsonError) {
      return '{...}';
    }
  default:
    // Anything else will be replaced with an empty string
    // For example: undefined, Symbol, etc.
    return '';
  }
}

/**
 * resolves the variable name to a value
 * If it fails, it tries the default resolver
 *
 * @param {ResolverFn} [resolver] - An optional function that will be
 *        called for every {{varName}} to generate a value. If the resolver throws an error
 *        we'll proceed with the default value resolution algorithm (find the value from the view
 *        object).
 * @param {string} varName - the variable name
 * @param {Object} view - the object to pass to the resolver function
 * @returns {*} - the value returned from the resolver
 */
function _resolve(resolver, varName, view) {
  try {
    return resolver(varName, view)
  } catch (e) {
    return _defaultResolver(varName, view)
  }
}

/**
 * replaces all occurances of {{ varName }} in the template
 * with what is returned from the resolver function
 *
 * @param {string} template - the template
 * @param {ResolverFn} [resolver] - An optional function that will be
 *        called for every {{varName}} to generate a value. If the resolver throws an error
 *        we'll proceed with the default value resolution algorithm (find the value from the view
 *        object).
 * @param {*} view - an object that will be passed to the resolver
 * @returns {string} - the resulting string
 */
function _replace(template, resolver, view) {
  let currentIndex, openIndex, closeIndex, before, varname
  const parts = []
  for (currentIndex = -2; currentIndex < template.length;) {
    openIndex = template.indexOf('{{', currentIndex)
    if (openIndex === -1) {
      break;
    }
    closeIndex = template.indexOf('}}', openIndex)
    if (closeIndex === -1) {
      break;
    }
    varname = template.substring(openIndex + 2, closeIndex).trim()
    closeIndex += 2
    before = template.substring(currentIndex, openIndex)
    currentIndex = closeIndex

    parts.push(before)
    parts.push(_valueToString(_resolve(resolver, varname, view)))
  }
  parts.push(template.substring(closeIndex))
  return parts.join('')
}

/**
 * Recursively goes through an object trying to resolve a path.
 *
 * @param {Object} scope - The object to traverse (in each recursive call we dig into this object)
 * @param {string[]} path - An array of property names to traverse one-by-one
 * @param {number} [pathIndex=0] - The current index in the path array
 */
function _recursivePathResolver(scope, path, pathIndex = 0) {
  if (typeof scope !== 'object' || scope === null || scope === undefined) {
    return '';
  }

  const varName = path[pathIndex];
  const value = scope[varName];

  if (pathIndex === path.length - 1) {
    // It's a leaf, return whatever it is
    return value;
  }

  return _recursivePathResolver(value, path, ++pathIndex);
}

function _defaultResolver(varName, view) {
  return _recursivePathResolver(view, varName.split('.'));
}

/**
 * Replaces every {{variable}} inside the template with values provided by view.
 *
 * @param {string} template - The template containing one or more {{variableNames}} every variable
 *        names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param {Object} [view={}] - An object containing values for every variable names that is used in
 *        the template. If it's omitted, it'll be set to an empty object essentially removing all
 *        {{varName}}s in the template.
 * @param {ResolverFn} [resolver] - An optional function that will be
 *        called for every {{varName}} to generate a value. If the resolver throws an error
 *        we'll proceed with the default value resolution algorithm (find the value from the view
 *        object).
 * @returns {string} - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
function render (template, view = {}, resolver = _defaultResolver) {
  // don't touch the template if it is not a string
  if (typeof template !== 'string') {
    return template;
  }

  return _replace(template, resolver, view);
}

module.exports = render;

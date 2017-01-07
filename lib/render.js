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

const VAR_MATCH_REGEX = /\{\{\s*(.*?)\s*\}\}/g;

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
 * Recursively goes through an object trying to resolve a path.
 *
 * @param {Object} scope - The object to traverse (in each recursive call we dig into this object)
 * @param {string[]} path - An array of keys to traverse one-by-one
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

function defaultResolver(varName, view) {
  return _recursivePathResolver(view, varName.split('.'));
}

/**
 * Replaces every {{variable}} inside the template with values provided by view.
 *
 * @param {string} template - The template containing one or
 *        more {{variableNames}}
 * @param {Object} [view={}] - An optional object containing values for
 *        every variable names that is used in the template. If it's omitted,
 *        it'll be assumed an empty object.
 * @param {ResolverFn} [resolver] - An optional function that will be
 *        called for every key to generate a value. If the resolver throws an error
 *        we'll proceed with the default value resolution algorithm.
 *        This function runs in the context of view.
 * @returns {string} - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
function render (template, view = {}, resolver = defaultResolver) {
  // don't touch the template if it is not a string
  if (typeof template !== 'string') {
    return template;
  }

  return template.replace(VAR_MATCH_REGEX, function (match, varName) {
    try {
      // defaultResolver never throws
      return _valueToString(resolver(varName, view));
    } catch (e) {
      // if your resolver throws, we proceed with the default resolver
      return _valueToString(defaultResolver(varName, view));
    }
  });
}

module.exports = render;

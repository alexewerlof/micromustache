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
function resolve(resolver, varName, view) {
  try {
    return resolver(varName, view)
  } catch (e) {
    return defaultResolver(varName, view)
  }
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

function defaultResolver(varName, view) {
  return _recursivePathResolver(view, varName.split('.'));
}

module.exports = { resolve, defaultResolver }

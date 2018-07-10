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

/**
 * Similar to lodash _.get()
 *
 * @throws
 * @param {Object} object - the view object
 * @param {string} path - the variable path to lookup
 * @returns {*} returns the value or undefined
 */
function get(object, path) {
  return _recursivePathResolver(object, path.split('.'));
}

module.exports = get

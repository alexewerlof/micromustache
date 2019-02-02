import { toPath } from './topath';

function isObject(val: any) {
  return val && typeof val === 'object';
}

/**
 * Recursively goes through an object trying to resolve a path.
 *
 * @param {Object} scope - The object to traverse (in each recursive call we dig into this object)
 * @param {string[]} path - An array of property names to traverse one-by-one
 * @param {number} [pathIndex=0] - The current index in the path array
 */
function _recursivePathResolver(scope: Scope, path: string[], pathIndex: number = 0) : any {
  if (!_isObject(scope)) {
    return '';
  }

  const varName: string = path[pathIndex];
  const value: any = scope[varName];

  if (pathIndex === path.length - 1) {
    // It's a leaf, return whatever it is
    return value;
  }

  return _recursivePathResolver(value, path, ++pathIndex);
}

/**
 * Similar to lodash _.get()
 *
 * @throws TypeError if the object variable is not an object
 * @param scope - the view object
 * @param path - the variable path to lookup
 * @returns returns the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
function get(scope: {}, path: string): any {
  if (!isObject(scope)) {
    throw new TypeError(`The scope should be an object but is ${typeof scope}: ${scope}`);
  }
  const keys = toPath(path);
  let currentScope = scope;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    currentScope = currentScope[key];
  }
  return currentScope
}

export default get;


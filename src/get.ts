import { toPath } from './to-path';
import { isObject } from './util';

/**
 * Similar to lodash _.get()
 *
 * Differences with JavaScript:
 * No support for keys that include `[` or `]`.
 * No support for keys that include `'` or `"` or `.
 * `foo[bar]` is allowed while JavaScript treats `bar` as a variable and tries to lookup
 * its value or throws a `ReferenceError` if there is no variable called `bar`.
 * @throws TypeError if the object variable is not an object
 * @param scope - the view object
 * @param key - the variable path to lookup
 * @returns returns the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export function get(scope: {}, key: string): any {
  if (!isObject(scope)) {
    throw new TypeError(`The scope should be an object but is ${typeof scope}: ${scope}`);
  }
  const keys = toPath(key);
  return getKeys(scope, keys);
}

/**
 * Similar to lodash _.get()
 * Same as get() but expects an array of keys instead of path
 * @throws TypeError if the scope variable is not an object or the keys don't exist
 * @param scope - an object to resolve value from
 * @param keys - an array of keys that specify the path to the lookup
 * @returns returns the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export function getKeys(scope: {}, keys: string[]): any {
  let currentScope = scope;
  for (const key of keys) {
    if (currentScope === undefined || currentScope === null) {
      throw new TypeError(`Cannot read property ${key} of ${currentScope}`);
    }
    // @ts-ignore
    currentScope = currentScope[key];
  }
  return currentScope
}

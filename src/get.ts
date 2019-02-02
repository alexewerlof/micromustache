import { toPath } from './topath';
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
 * @param path - the variable path to lookup
 * @returns returns the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export function get(scope: {}, path: string): any {
  if (!isObject(scope)) {
    throw new TypeError(`The scope should be an object but is ${typeof scope}: ${scope}`);
  }
  const keys = toPath(path);
  let currentScope = scope;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (currentScope === undefined || currentScope === null) {
      throw new TypeError(`Cannot read property ${key} of ${currentScope}`);
    }
    // @ts-ignore
    currentScope = currentScope[key];
  }
  return currentScope
}

import { toPath } from './to-path'
import { isValidScope, assertType, assertReference } from './util'

// tslint:disable-next-line ban-types
export type Scope = {} | Function

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
 * @returns - the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export function get(scope: Scope, path: string): any {
  assertType(
    isValidScope(scope),
    'The scope should be an object or function but is',
    typeof scope,
    scope
  )
  const pathArr = toPath(path)
  return getKeys(scope, pathArr)
}

/**
 * Same as get() but expects an array of keys instead of path
 * @throws TypeError if the scope variable is not an object or the keys don't exist
 * @param scope - an object to resolve value from
 * @param pathArr - an array of keys that specify the path to the lookup
 * @returns - the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export function getKeys(scope: Scope, pathArr: string[]): any {
  let currentScope = scope
  for (const key of pathArr) {
    assertReference(isValidScope(currentScope), key, 'is not defined')
    // @ts-ignore
    currentScope = currentScope[key]
  }
  return currentScope
}

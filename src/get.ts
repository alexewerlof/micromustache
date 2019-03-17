import { cached, PropNames } from './topath'

// tslint:disable-next-line ban-types
export type Scope = {} | Function

/**
 * Checks if the provided value can be used as a scope, that is a non-null
 * object or a function.
 * @param val - the value that is supposed to be tested
 */
function isValidScope(val: any): val is Scope {
  if (val) {
    // At this point `null` is filtered out
    const type = typeof val
    return type === 'object' || type === 'function'
  }
  return false
}

/**
 * Similar to lodash _.get()
 *
 * Differences with JavaScript:
 * No support for keys that include `[` or `]`.
 * No support for keys that include `'` or `"` or `.
 * `foo[bar]` is allowed while JavaScript treats `bar` as a variable and tries
 * to lookup its value or throws a `ReferenceError` if there is no variable
 * called `bar`.
 * Same as get() but expects an array of keys instead of the path string.
 * If it cannot find a value in the specified path, it may return undefined or
 * throw an error depending on the value of the `validVarName` param.
 * @throws ReferenceError if the scope does not contain the keys in the pathArr
 * parameter and the `validVarName` is set to a truthy value
 * @throw SyntaxError if the path itself cannot be parsed
 * @param scope - an object to resolve value from
 * @param path - the variable path to lookup or an array of keys that specify
 * the path to the lookup
 * @param validVarName - claiming that the varName is exists in the scope
 * @returns - the value or undefined. If path or scope are undefined or scope is
 * null the result is always undefined.
 */
export function get(
  scope: Scope,
  path: PropNames | string,
  validVarName?: boolean
): any {
  const pathArr = Array.isArray(path) ? path : cached.toPath(path)

  let currentScope = scope
  for (const key of pathArr) {
    if (isValidScope(currentScope)) {
      // @ts-ignore
      currentScope = currentScope[key]
    } else if (validVarName) {
      throw new ReferenceError(
        key +
          ' is not defined in the scope (' +
          scope +
          '). Parsed path: ' +
          pathArr
      )
    } else {
      return
    }
  }
  return currentScope
}

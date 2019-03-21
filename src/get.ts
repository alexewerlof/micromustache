import { toPath, PropNames } from './topath'

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
 * Similar to lodash `_.get()`
 *
 * Differences with JavaScript:
 * No support for keys that include `[` or `]`.
 * No support for keys that include `'` or `"` or `.
 * `foo[bar]` is allowed while JavaScript treats `bar` as a variable and tries
 * to lookup its value or throws a `ReferenceError` if there is no variable
 * called `bar`.
 * If it cannot find a value in the specified path, it may return undefined or
 * throw an error depending on the value of the `propExists` param.
 * @throw SyntaxError if the varName string cannot be parsed
 * @throws ReferenceError if the scope does not contain the requested key
 * but the `propExists` is set to a truthy value
 * @param scope - an object to resolve value from
 * @param varNameOrPropNames - the variable name string or an array of property
 * names (as returned by `toPath()`)
 * @param propExists - claiming that the varName is exists in the scope
 * @returns - the value or undefined. If path or scope are undefined or scope is
 * null the result is always undefined.
 */
export function get(
  scope: Scope,
  varNameOrPropNames: PropNames | string,
  propExists?: boolean
): any {
  const propNames = Array.isArray(varNameOrPropNames)
    ? varNameOrPropNames
    : toPath.cached(varNameOrPropNames)

  let currentScope = scope
  for (const propName of propNames) {
    if (isValidScope(currentScope)) {
      // @ts-ignore
      currentScope = currentScope[propName]
    } else if (propExists) {
      throw new ReferenceError(
        propName +
          ' is not defined in the scope (' +
          scope +
          '). Parsed path: ' +
          propNames
      )
    } else {
      return
    }
  }
  return currentScope
}

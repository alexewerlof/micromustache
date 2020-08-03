import { toPath } from './topath'
import { isProp } from './utils'

export interface Scope {
  [key: string]: Scope | any
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
 * @param scope an object to resolve value from
 * @param varNameOrPropNames the variable name string or an array of property
 * names (as returned by `toPath()`)
 * @param propExists claiming that the varName is exists in the scope.
 * It defaults to false which means we don't throw an error (like Mustachejs).
 * @throws `SyntaxError` if the varName string cannot be parsed
 * @throws `ReferenceError` if the scope does not contain the requested key
 * but the `propExists` is set to a truthy value
 * @returns the value or undefined. If path or scope are undefined or scope is
 * null the result is always undefined.
 */
export function get(
  scope: Scope,
  varNameOrPropNames: string | string[],
  propExists?: boolean
): any {
  const propNames = Array.isArray(varNameOrPropNames)
    ? varNameOrPropNames
    : toPath.cached(varNameOrPropNames)

  let currentScope = scope
  for (const propName of propNames) {
    if (isProp(currentScope, propName)) {
      currentScope = currentScope[propName]
    } else if (propExists) {
      throw new ReferenceError(
        `${propName} is not defined in the scope (${String(scope)}) at path: ${propNames.join('.')}`
      )
    } else {
      return
    }
  }
  return currentScope
}

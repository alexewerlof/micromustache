import { toPath, PropNames } from './topath'

export type Scope = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [val: string]: Scope | any
}

/**
 * Checks if the provided value can be used as a scope, that is a non-null
 * object or a function.
 * @param val the value that is supposed to be tested
 */
function isValidScope(val: unknown): val is Scope {
  switch (typeof val) {
  case 'object':
    return Boolean(val)
  case 'function':
    return true
  default:
    return false
  }
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
  varNameOrPropNames: PropNames | string,
  propExists?: boolean
): undefined | Scope {
  const propNames = Array.isArray(varNameOrPropNames)
    ? varNameOrPropNames
    : toPath.cached(varNameOrPropNames)

  let currentScope = scope
  for (const propName of propNames) {
    if (isValidScope(currentScope)) {
      currentScope = currentScope[propName]
    } else if (propExists) {
      throw new ReferenceError(
        propName + ' is not defined in the scope (' + scope + '). Parsed path: ' + propNames
      )
    } else {
      return
    }
  }
  return currentScope
}

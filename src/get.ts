import { toPath } from './topath'
import { isObj, isProp } from './utils'

export interface Scope {
  [key: string]: Scope | any
}

export interface IGetOptions {
  /**
   * When set to a truthy value, we throw a ReferenceError for invalid varNames.
   * Invalid varNames are the ones that do not exist in the scope.
   * In that case the value for the varNames will be assumed an empty string.
   * By default we throw a ReferenceError to be compatible with how JavaScript
   * threats such invalid reference.
   * If a value does not exist in the scope, two things can happen:
   * - if `propsExist` is truthy, the value will be assumed empty string
   * - if `propsExist` is falsy, a ReferenceError will be thrown
   */
  readonly propsExist?: boolean
  /**
   * Drilling a nested object to get the value assinged with a path is a relatively expensive
   * computation. Therefore you can set a value of how deep you are expecting a template to go and
   * if the nesting is deeper than that, the computation stops with an error.
   * This prevents a malicious or erronous template with deep nesting to block the JavaScript event
   * loop. The default is 10.
   */
  readonly depth?: number
}

/**
 * Similar to lodash `_.get()`
 *
 * Differences with JavaScript:
 * No support for keys that include `[` or `]`.
 * No support for keys that include `'` or `"` or `.
 * `foo[bar]` is allowed while JavaScript treats `bar` as a variable and tries to lookup its value
 * or throws a `ReferenceError` if there is no variable called `bar`.
 * If it cannot find a value in the specified path, it may return undefined or throw an error
 * depending on the value of the `propsExist` param.
 * @param scope an object to resolve value from
 * @param varNameOrPropNames the variable name string or an array of property names (as returned by
 * `toPath()`)
 * @throws `SyntaxError` if the varName string cannot be parsed
 * @throws `ReferenceError` if the scope does not contain the requested key and the `propsExist` is
 * set to a truthy value
 * @returns the value or undefined. If path or scope are undefined or scope is null the result is
 * always undefined.
 */
export function get(
  scope: Scope,
  varNameOrPropNames: string | string[],
  options: IGetOptions = {}
): any {
  if (!isObj(options)) {
    throw new TypeError(`get expects an object option. Got ${typeof options}`)
  }
  const propNames = Array.isArray(varNameOrPropNames)
    ? varNameOrPropNames
    : toPath.cached(varNameOrPropNames)

  const { depth = 10 } = options
  if (propNames.length > depth) {
    throw new ReferenceError(
      `The path cannot be deeper than ${depth} levels. Got "${propNames.join(' > ')}"`
    )
  }
  let currentScope = scope
  for (const propName of propNames) {
    if (isProp(currentScope, propName)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      currentScope = currentScope[propName]
    } else if (options.propsExist) {
      throw new ReferenceError(
        `${propName} is not defined in the scope (${String(scope)}) at path: ${propNames.join('.')}`
      )
    } else {
      return
    }
  }
  return currentScope
}

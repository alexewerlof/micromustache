import { parseRef } from './parse'
import { isObj, isProp, isNum } from './utils'

export interface Scope {
  [key: string]: Scope | any
}

export interface GetOptions {
  /**
   * When set to a truthy value, we throw a `ReferenceError` for invalid refs and paths.
   * - An invalid path specifies an array of properties that does not exist in the scope.
   * - An invalid ref is a string that is parsed to an invalid path.
   *
   * When set to a falsy value, we use an empty string for refs and paths that don't exist in the
   * scope.
   *
   * If a value does not exist in the scope, two things can happen:
   * - if `validatePath` is truthy, the value will be assumed empty string
   * - if `validatePath` is falsy, a `ReferenceError` will be thrown
   */
  readonly validatePath?: boolean
  /**
   * Drilling a nested object to get the value assigned with a path is a relatively expensive
   * computation. Therefore you can set a value of how deep you are expecting a template to go and
   * if the nesting is deeper than that, the computation stops with an error.
   * This prevents a malicious or erroneous template with deep nesting to block the JavaScript event
   * loop. The default is 10.
   */
  readonly maxPathLen?: number
}

/**
 * A useful utility function that is used internally to lookup a ref as a path to a
 * property in an object. It can also be used in your custom resolver functions if needed.
 *
 * This is similar to [Lodash's `_.get()`](https://lodash.com/docs/#get)
 *
 * It has a few differences with plain JavaScript syntax:
 * - No support for keys that include `[` or `]`.
 * - No support for keys that include `'` or `"` or `.`.
 * @see https://github.com/userpixel/micromustache/wiki/Known-issues
 * If it cannot find a value in the specified path, it may return undefined or throw an error
 * depending on the value of the `validatePath` param.
 * @param scope an object to resolve value from
 * @param refOrPath the ref string or a path array (see [[parseRef]])
 * @throws `SyntaxError` if the ref string cannot be parsed
 * @throws `ReferenceError` if the scope does not contain the requested key and the `validatePath`
 * is set to a truthy value
 * @returns the value or undefined. If path or scope are undefined or scope is null the result is
 * always undefined.
 */
export function get(scope: Scope, refOrPath: string | string[], options: GetOptions = {}): any {
  if (!isObj(options)) {
    throw new TypeError(`get expects an object option. Got ${typeof options}`)
  }

  const { maxPathLen = 10 } = options
  if (!isNum(maxPathLen) || maxPathLen <= 0) {
    throw new RangeError(`Expected a positive number for maxPathLen. Got ${maxPathLen}`)
  }

  const path = Array.isArray(refOrPath) ? refOrPath : parseRef.cached(refOrPath)

  const propNamesAsStr = () => path.join(' > ')

  if (path.length > maxPathLen) {
    throw new ReferenceError(
      `The path cannot be deeper than ${maxPathLen} levels. Got "${propNamesAsStr()}"`
    )
  }

  let currentScope = scope
  for (const prop of path) {
    if (isProp(currentScope, prop)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      currentScope = currentScope[prop]
    } else if (options.validatePath) {
      throw new ReferenceError(`${prop} is not defined in the scope at path: "${propNamesAsStr()}"`)
    } else {
      return
    }
  }
  return currentScope
}

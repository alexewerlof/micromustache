import { parsePath } from './parse'
import { isObj, isProp, isNum, isArr } from './utils'

export interface Scope {
  [key: string]: Scope | any
}

export interface GetOptions {
  /**
   * When set to a truthy value, we throw a `ReferenceError` for invalid paths and refs.
   * - An invalid ref specifies an array of properties that does not exist in the scope.
   * - An invalid path is a string that is parsed to an invalid ref.
   *
   * When set to a falsy value, we use an empty string for paths and refs that don't exist in the
   * scope.
   *
   * If a value does not exist in the scope, two things can happen:
   * - if `validateRef` is falsy, the value will be assumed empty string
   * - if `validateRef` is truthy, a `ReferenceError` will be thrown
   */
  readonly validateRef?: boolean
  /**
   * Drilling a nested object to get the value assigned with a ref is a relatively expensive
   * computation. Therefore you can set a value of how deep you are expecting a template to go and
   * if the nesting is deeper than that, the computation stops with an error.
   * This prevents a malicious or erroneous template with deep nesting to block the JavaScript event
   * loop. The default is 10.
   */
  readonly maxRefDepth?: number
}

export function getRef(scope: Scope, ref: string[], options: GetOptions = {}): any {
  if (!isObj(options)) {
    throw new TypeError(`get expects an object option. Got ${typeof options}`)
  }

  if (!isArr(ref)) {
    throw new TypeError(`Expected an array ref. Got ${ref}`)
  }

  const { maxRefDepth = 10 } = options
  if (!isNum(maxRefDepth) || maxRefDepth <= 0) {
    throw new RangeError(`Expected a positive number for maxRefDepth. Got ${maxRefDepth}`)
  }

  const propNamesAsStr = () => ref.join(' > ')

  if (ref.length > maxRefDepth) {
    throw new ReferenceError(
      `The ref cannot be deeper than ${maxRefDepth} levels. Got "${propNamesAsStr()}"`
    )
  }

  let currentScope = scope
  for (const prop of ref) {
    if (isProp(currentScope, prop)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      currentScope = currentScope[prop]
    } else if (options.validateRef) {
      throw new ReferenceError(`${prop} is not defined in the scope at ref: "${propNamesAsStr()}"`)
    } else {
      // This undefined result will be stringified later according to the explicit option
      return
    }
  }
  return currentScope
}

/**
 * A useful utility function that is used internally to lookup a path as a ref to a
 * property in an object. It can also be used in your custom resolver functions if needed.
 *
 * This is similar to [Lodash's `_.get()`](https://lodash.com/docs/#get)
 *
 * It has a few differences with plain JavaScript syntax:
 * - No support for keys that include `[` or `]`.
 * - No support for keys that include `'` or `"` or `.`.
 * @see https://github.com/userpixel/micromustache/wiki/Known-issues
 * If it cannot find a value in the specified ref, it may return undefined or throw an error
 * depending on the value of the `validateRef` param.
 * @param scope an object to resolve value from
 * @param path the path string or a ref array (see [[parsePath]])
 * @throws `SyntaxError` if the path string cannot be parsed
 * @throws `ReferenceError` if the scope does not contain the requested key and the `validateRef`
 * is set to a truthy value
 * @returns the value or undefined. If ref or scope are undefined or scope is null the result is
 * always undefined.
 */
export function get(scope: Scope, path: string, options: GetOptions = {}): any {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return getRef(scope, parsePath(path), options)
}

import { pathToRef, Ref, PathToRefOptions } from './tokenize'
import { isObj, isProp, isNum, isArr } from './utils'
import { MAX_REF_DEPTH } from './defaults'

export interface Scope {
  [key: string]: Scope | any
}

/**
 * Just a small utility function that's used in the [[refGet]] function to generate a string
 * representation of paths in the errors.
 *
 * @internal
 *
 * @param ref the reference to convert to string
 */
function refToPath(ref: Ref) {
  return `"${ref.join('.')}"`
}

/**
 * The options to the [[pathGet]] and [[refGet]] functions
 */
export interface GetOptions extends PathToRefOptions {
  /**
   * Decides how to deal with references that don't exist in the scope.
   *
   * If a value does not exist in the scope, two things can happen:
   * - if `validateRef` is falsy, the value will be assumed empty string
   * - if `validateRef` is truthy, a `ReferenceError` will be thrown
   * @default undefined
   */
  readonly validateRef?: boolean
}

/**
 * Looks up the value of a given [[Ref]] in the [[Scope]]
 * You can also use this function in your own custom resolvers.
 *
 * If it cannot find the value at the specified ref, it returns `undefined`. You can change this
 * behavior by passing a truthy `validateRef` option.
 *
 * @see https://github.com/userpixel/micromustache/wiki/Known-issues
 *
 * @param ref the tokenized path (see [[pathToRef]])
 * @param scope an object to resolve values from
 *
 * @returns the value or undefined
 *
 * @throws `TypeError` if the arguments have the wrong type
 * @throws `ReferenceError` if the scope does not contain the requested key and the `validateRef`
 * is set to a truthy value
 */
export function refGet(ref: Ref, scope: Scope, options: GetOptions = {}): any {
  if (!isObj(scope)) {
    throw new TypeError(`refGet() expects an object scope. Got ${typeof options}`)
  }

  if (!isObj(options)) {
    throw new TypeError(`refGet() expects an object option. Got ${typeof options}`)
  }

  if (!isArr(ref)) {
    throw new TypeError(`Expected an array ref. Got ${ref}`)
  }

  const { maxRefDepth = MAX_REF_DEPTH } = options
  if (!isNum(maxRefDepth) || maxRefDepth <= 0) {
    throw new RangeError(`Expected a positive number for maxRefDepth. Got ${maxRefDepth}`)
  }

  if (ref.length > maxRefDepth) {
    throw new ReferenceError(
      `The ref cannot be deeper than ${maxRefDepth} levels. Got ${refToPath(ref)}`
    )
  }

  let currentScope = scope
  for (const prop of ref) {
    if (isProp(currentScope, prop)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      currentScope = currentScope[prop]
    } else if (options.validateRef) {
      throw new ReferenceError(`${prop} is not defined in the scope at ref: ${refToPath(ref)}`)
    } else {
      // This undefined result will be stringified later according to the explicit option
      return
    }
  }
  return currentScope
}

/**
 * Looks up the value of a given `path` string in the [[Scope]]
 *
 * It uses [[refGet]] under the hood.
 *
 * You can also use this function in your own custom resolvers.
 *
 * @param path the path string as it appeared in the template
 * @param scope an object to resolve value from
 *
 * @throws any error that [[refGet]] or [[pathToRef]] may throw
 *
 * @returns the value or undefined
 */
export function pathGet(path: string, scope: Scope, options: GetOptions = {}): any {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return refGet(pathToRef(path, options), scope, options)
}

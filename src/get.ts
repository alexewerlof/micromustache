import { pathToRef, Ref, PathToRefOptions } from './ref'
import { isObj, isProp, isNum, isArr, optObj, newTypeError, newRangeError, newReferenceError } from './utils'
import { MAX_REF_DEPTH } from './defaults'
import { CompiledTemplate, isCompiledTemplate } from './compile'
import { ParsedTemplate, isParsedTemplate } from './parse'

export interface Scope {
  [key: string]: Scope | any
}

/**
 * The options for the [[resolve]] function
 */
export type ResolveOptions = GetOptions

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
 * @param ref the path that is already converted to ref (see [[pathToRef]])
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
    throw newTypeError(refGet, 'an object scope', scope)
  }

  if (!isArr(ref)) {
    throw newTypeError(refGet, 'an array ref', ref)
  }

  const { maxRefDepth = MAX_REF_DEPTH } = optObj<GetOptions>(refGet, options)

  if (!isNum(maxRefDepth) || maxRefDepth <= 0) {
    throw newRangeError(refGet, 'expected a positive number for maxRefDepth but got', maxRefDepth)
  }

  if (ref.length > maxRefDepth) {
    throw newReferenceError(refGet, 'got a ref deeper than', maxRefDepth, 'levels:', refToPath(ref))
  }

  let currentScope = scope
  for (const prop of ref) {
    if (isProp(currentScope, prop)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      currentScope = currentScope[prop]
    } else if (options.validateRef) {
      throw newReferenceError(
        refGet, refToPath(ref), 'is invalid because', prop, 'property does not exist in the scope'
      )
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

/**
 * Resoles the subs in a parsed or compiled template object from the scope
 * @param templateObj the parsed or compiled template object
 * @param scope An object containing values for paths from the the
 * template. If it's omitted, we default to an empty object.
 * Since functions are objects in javascript, the `scope` can technically be a
 * function too but it won't be called. It'll be treated as an object and its
 * properties will be used for the lookup.
 * @param options
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function resolve(
  templateObj: CompiledTemplate | ParsedTemplate<string>,
  scope: Scope,
  options?: ResolveOptions
): ParsedTemplate<any> {
  if (isCompiledTemplate(templateObj)) {
    const { strings, refs } = templateObj
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return { strings, subs: refs.map((ref: Ref) => refGet(ref, scope, options)) }
  } else if (isParsedTemplate(templateObj)) {
    const { strings, subs } = templateObj
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return { strings, subs: subs.map((path: string) => pathGet(path, scope, options)) }
  }

  throw newTypeError(
    resolve, 'a valid CompiledTemplate or ParsedTemplate', templateObj
  )
}

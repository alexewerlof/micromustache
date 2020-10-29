import { isStr, rngErr, synErr, typErr, optObj } from './utils'
import { MAX_REF_DEPTH, CACHE_SIZE } from './defaults'

/**
 * The options for the [[pathToRef]] function
 */
export interface PathToRefOptions {
  /**
   * Drilling a nested object to get the value assigned with a ref is a relatively expensive
   * computation. Therefore you can set a value of how deep you are expecting a template to go and
   * if the nesting is deeper than that, the computation stops with an error.
   * This prevents a malicious or erroneous template with deep nesting to block the JavaScript event
   * loop.
   *
   * @default defaults.MAX_REF_DEPTH
   *
   * @example `path = 'a.b'`, depth = 2
   * @example `path = 'a.b.c'`, depth = 3
   * @example `path = 'a['b'].c'`, depth = 3
   */
  readonly maxRefDepth?: number
}

/**
 *
 * The parsed path which is called a "Ref" in micromustache lingo. Each Ref is one array of
 * strings.
 * @example For `'Hi {{person.firstName}} {{person.lastName}}!'`, there are two paths:
 * - `'person.firstName'` which gives us `['person', 'firstName']` as a Ref
 * - `'person.lastName'` which gives us `['person', 'lastName']` as a Ref
 *
 * Therefore the `subs` property will be `[['person', 'firstName'], ['person', 'lastName']`
 */
export type Ref = string[]

/** @internal */
interface RegExpWithNameGroup extends RegExpExecArray {
  groups: {
    name: string
  }
}

/** @internal */
const pathPatterns: Array<RegExp> = [
  // `.a` the most common pattern (hence first)
  /\s*\.\s*(?<name>[$_\w]+)\s*/y,
  // `a['b']` or `a["b"]` or `a[\`b\`]`
  /\s*\[\s*(?<quote>['"`])(?<name>.*?)\k<quote>\s*\]\s*/y,
  // `a[N]` where N is a positive integer (`String(Number.MAX_SAFE_INTEGER).length` is 16)
  /\s*\[\s*\+?\s*0*(?<name>\d{1,16}?)\s*\]\s*/y,
  // `a` at the start of the string
  /^\s*(?<name>[$_\w]+)\s*/y,
]

/**
 * Breaks a path to an array of strings.
 * The result can be used to [[pathGet]] a particular value from a [[Scope]] object
 * @param path - the path as it occurs in the template.
 * For example `a["b"].c`
 * @throws `TypeError` if the path is not a string
 * @throws `SyntaxError` if the path syntax has a problem
 * @throws `RangeError` if the resulting reference is deeper than the limit specified by the
 * `maxRefDepth` option
 * @returns - an array of property names that can be used to get a particular value.
 * For example `['a', 'b', 'c']`
 */
export function pathToRef(path: string, options: PathToRefOptions = {}): Ref {
  if (!isStr(path)) {
    throw typErr(pathToRef, 'a path string', path)
  }

  const { maxRefDepth = MAX_REF_DEPTH } = optObj<PathToRefOptions>(pathToRef, options)

  const ref: Ref = []

  if (path.trim() === '') {
    return ref
  }

  let currIndex = 0

  let patternMatched

  do {
    patternMatched = false
    for (const pattern of pathPatterns) {
      pattern.lastIndex = currIndex
      const searchResult = pattern.exec(path)

      if (searchResult) {
        patternMatched = true
        currIndex = pattern.lastIndex
        // For perf reasons we assume that all regex groups have a capture group called name
        ref.push((searchResult as RegExpWithNameGroup).groups.name)
        if (ref.length > maxRefDepth) {
          throw rngErr(
            pathToRef, 'encountered the path', path, 'which is', ref.length - maxRefDepth,
            'chars longer than the configured limit of', maxRefDepth
          )
        }

        break
      }
    }
  } while (patternMatched)

  if (currIndex !== path.length) {
    throw synErr(pathToRef, 'cannot convert the entire path', path, 'to a ref')
  }

  return ref
}

/**
 * @internal
 */
export class Cache<T> extends Map<string, T> {
  private cachedKeys: string[]
  private oldestIndex = 0

  constructor(limit: number) {
    super()
    this.cachedKeys = new Array<string>(limit)
  }

  get limit(): number {
    return this.cachedKeys.length
  }

  public set(key: string, value: T): this {
    super.set(key, value)
    const oldestKey = this.cachedKeys[this.oldestIndex]
    if (oldestKey !== undefined) {
      this.delete(oldestKey)
    }
    this.cachedKeys[this.oldestIndex] = key
    this.oldestIndex = (this.oldestIndex+ 1) % this.limit
    return this
  }
}

/** @internal */
const pathToRefCache = new Cache<string[]>(CACHE_SIZE)

/**
 * This is just a faster version of `pathToRef()`
 * @internal
 */
export function cachedPathToRef(path: string, options: PathToRefOptions = {}): Ref {
  let result = pathToRefCache.get(path)

  if (result === undefined) {
    result = pathToRef(path, options)
    pathToRefCache.set(path, result)
  }

  const { maxRefDepth = MAX_REF_DEPTH } = options
  if (maxRefDepth < result.length) {
    throw rngErr(
      cachedPathToRef, 'the reference depth for', path,
      'exceeds the configured max ref depth of', maxRefDepth
    )
  }

  return result
}

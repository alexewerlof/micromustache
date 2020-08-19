import { isObj, isStr } from './utils'
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
  // `.a` the most common patter (hence first)
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
    throw new TypeError(
      `Cannot convert a non-string path to ref. Expected a string. Got a ${typeof path}`
    )
  }

  if (!isObj(options)) {
    throw new TypeError(`pathToRef() expected an options object. Got ${options}`)
  }

  const { maxRefDepth = MAX_REF_DEPTH } = options

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
          throw new RangeError(
            `The reference depth for "${path}" exceeds the configured max ref depth of ${maxRefDepth}`
          )
        }

        break
      }
    }
  } while (patternMatched)

  if (currIndex !== path.length) {
    throw new SyntaxError(`Could not convert path "${path}" to ref`)
  }

  return ref
}

/**
 * @internal
 * The number of different paths that will be cached.
 * If a path is cached, the actual tokenization algorithm will not be called which significantly
 * improves performance.
 * However, this cache is size-limited to prevent degrading the user's software over a period of
 * time.
 * If the cache is full, we start removing older paths one at a time.
 */
const cacheSize = CACHE_SIZE

/**
 * @internal
 */
export class Cache<T> {
  private readonly map: Record<string, T> = {}

  private cachedKeys: string[]
  private oldestIndex: number

  constructor(private size: number) {
    this.reset()
  }

  public reset(): void {
    this.oldestIndex = 0
    this.cachedKeys = new Array<string>(this.size)
  }

  public pathGet(key: string): T {
    return this.map[key]
  }

  public set(key: string, value: T): void {
    this.map[key] = value
    const oldestKey = this.cachedKeys[this.oldestIndex]
    if (oldestKey !== undefined) {
      delete this.map[oldestKey]
    }
    this.cachedKeys[this.oldestIndex] = key
    this.oldestIndex++
    this.oldestIndex %= this.size
  }
}

/** @internal */
const cache = new Cache<string[]>(cacheSize)

/**
 * This is just a faster version of `pathToRef()`
 * @internal
 */
function pathToRefCached(path: string, options: PathToRefOptions = {}): Ref {
  let result = cache.pathGet(path)

  if (result === undefined) {
    result = pathToRef(path, options)
    cache.set(path, result)
  }

  const { maxRefDepth = MAX_REF_DEPTH } = options
  if (maxRefDepth < result.length) {
    throw new RangeError(
      `The reference depth for "${path}" exceeds the configured max ref depth of ${maxRefDepth}`
    )
  }

  return result
}

pathToRef.cached = pathToRefCached

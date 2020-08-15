import { isObj, isStr } from './utils'

export interface TokenizePathOptions {
  /**
   * Drilling a nested object to get the value assigned with a ref is a relatively expensive
   * computation. Therefore you can set a value of how deep you are expecting a template to go and
   * if the nesting is deeper than that, the computation stops with an error.
   * This prevents a malicious or erroneous template with deep nesting to block the JavaScript event
   * loop. The default is 10.
   */
  readonly maxRefDepth?: number
}

/**
 * An array that is derived from a path string
 * For example, if your template has a path that looks like `'person.name'`, its corresponding Ref
 * looks like `['person', 'name']`
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
 * The result can be used to [[getPath]] a particular value from a [[Scope]] object
 * @param path - the path as it occurs in the template.
 * For example `a["b"].c`
 * @throws `TypeError` if the path is not a string
 * @throws `SyntaxError` if the path syntax has a problem
 * @returns - an array of property names that can be used to get a particular value.
 * For example `['a', 'b', 'c']`
 */
export function tokenizePath(path: string, options: TokenizePathOptions = {}): Ref {
  if (!isStr(path)) {
    throw new TypeError(`Cannot tokenize path. Expected string. Got a ${typeof path}`)
  }

  if (!isObj(options)) {
    throw new TypeError(`tokenizePath() expected an options object. Got ${options}`)
  }

  const { maxRefDepth = 10 } = options

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
          throw new Error(`The reference dept exceeds the configured limit of ${maxRefDepth}`)
        }

        break
      }
    }
  } while (patternMatched)

  if (currIndex !== path.length) {
    throw new SyntaxError(`Could not tokenize path: "${path}"`)
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
const cacheSize = 1000

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

  public getPath(key: string): T {
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
 * This is just a faster version of `tokenizePath()`
 * @internal
 */
function tokenizePathCached(path: string, options: TokenizePathOptions = {}): Ref {
  let result = cache.getPath(path)

  if (result === undefined) {
    result = tokenizePath(path, options)
    cache.set(path, result)
  }

  return result
}

tokenizePath.cached = tokenizePathCached

import { isStr } from './utils'

/**
 * @internal
 * The number of different refs that will be cached.
 * If a ref is cached, the actual parsing algorithm will not be called
 * which significantly improves performance.
 * However, this cache is size-limited to prevent degrading the user's software
 * over a period of time.
 * If the cache is full, we start removing older refs one at a time.
 */
const cacheSize = 1000

/**
 * @internal
 */
export class Cache<T> {
  private map: {
    [ref: string]: T
  }

  private cachedKeys: string[]
  private oldestIndex: number

  constructor(private size: number) {
    this.reset()
  }

  public reset(): void {
    this.oldestIndex = 0
    this.map = {}
    this.cachedKeys = new Array<string>(this.size)
  }

  public get(key: string): T {
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
 * Breaks a reference to an array of strings.
 * The result can be used to [[get]] a particular value from a [[Scope]] object
 * @param ref - the ref as it occurs in the template.
 * For example `a["b"].c`
 * @throws `TypeError` if the ref is not a string
 * @throws `SyntaxError` if the ref syntax has a problem
 * @returns - an array of property names that can be used to get a particular
 * value.
 * For example `['a', 'b', 'c']`
 */
export function parseRef(ref: string): string[] {
  if (!isStr(ref)) {
    throw new TypeError(`Cannot parse path. Expected string. Got a ${typeof ref}`)
  }

  const path: string[] = []

  if (ref.trim() === '') {
    return path
  }

  let currIndex = 0

  let patternMatched

  do {
    patternMatched = false
    for (const pattern of pathPatterns) {
      pattern.lastIndex = currIndex
      const parsedResult = pattern.exec(ref)

      if (parsedResult) {
        patternMatched = true
        currIndex = pattern.lastIndex
        // For perf reasons we assume that all regex groups have a capture group called name
        path.push((parsedResult as RegExpWithNameGroup).groups.name)
        break
      }
    }
  } while (patternMatched)

  if (currIndex !== ref.length) {
    throw new SyntaxError(`Could not parse ref: "${ref}"`)
  }

  return path
}

/**
 * This is just a faster version of `parseRef()`
 * @internal
 */
function parseRefCached(ref: string): string[] {
  let result = cache.get(ref)

  if (result === undefined) {
    result = parseRef(ref)
    cache.set(ref, result)
  }

  return result
}

parseRef.cached = parseRefCached

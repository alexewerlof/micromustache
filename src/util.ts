import { Scope } from './get'

/**
 * Checks if the provided value is an object but is not null
 * @param val - the value that is supposed to be tested
 */
export function isObject(val: any): val is object {
  return val && typeof val === 'object'
}

/**
 * Checks if the provided value can be used as a scope, that is a non-null
 * object or a function.
 * @param val - the value that is supposed to be tested
 */
export function isValidScope(val: any): val is Scope {
  if (val) {
    // At this point `null` is filtered out
    const type = typeof val
    return type === 'object' || type === 'function'
  }
  return false
}

/**
 * Checks if a value is a string and optionally if it is non empty
 * @param val - the value that is supposed to be tested
 * @param nonEmpty - also check if the string is not empty
 */
export function isString(val: any, nonEmpty?: boolean): val is string {
  if (typeof val === 'string') {
    return nonEmpty ? val.length > 0 : true
  }
  return false
}

export class CachedFn<T> {
  private cache: {
    [key: string]: T
  } = {}

  private keys: string[]
  private currKeyIndex = 0

  constructor(private fn: (arg: string) => T, private size: number = 100) {
    this.keys = new Array(size)
  }

  public clear() {
    this.cache = {}
  }

  public obtain(key: string): T {
    let result = this.cache[key]
    if (!result) {
      result = this.cache[key] = this.fn(key)
      const keyToDelete = this.keys[this.currKeyIndex]
      if (keyToDelete !== undefined) {
        delete this.cache[keyToDelete]
      }
      this.keys[this.currKeyIndex] = key
      this.currKeyIndex++
      this.currKeyIndex %= this.size
    }
    return result
  }
}

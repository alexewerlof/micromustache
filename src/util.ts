import { Scope } from './get'

export function isObject(val: any): val is object {
  return val && typeof val === 'object'
}

export function isValidScope(val: any): val is Scope {
  if (!val) {
    return false
  }
  const type = typeof val
  return type === 'object' || type === 'function'
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

// tslint:disable-next-line:ban-types
export function isFunction(val: any): val is Function {
  return typeof val === 'function'
}

export function isDefined(val: any) {
  return val !== undefined
}

function createError(
  errorConstructor:
    | ErrorConstructor
    | SyntaxErrorConstructor
    | TypeErrorConstructor
    | ReferenceErrorConstructor,
  messageParts: any[]
) {
  return new errorConstructor(messageParts.join(' '))
}

export function assertTruthy(expression: any, ...messageParts: any[]) {
  if (!expression) {
    throw createError(Error, messageParts)
  }
}

export function assertSyntax(expression: any, ...messageParts: any[]) {
  if (!expression) {
    throw createError(SyntaxError, messageParts)
  }
}

export function assertType(expression: any, ...messageParts: any[]) {
  if (!expression) {
    throw createError(TypeError, messageParts)
  }
}

export function assertReference(expression: any, ...messageParts: any[]) {
  if (!expression) {
    throw createError(ReferenceError, messageParts)
  }
}

export class Memoizer<T> {
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

  public get(key: string): T {
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

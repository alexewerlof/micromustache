import { Scope } from './types'

export function isObject(val: any) {
  return val && typeof val === 'object'
}

export function isValidScope(val: any) {
  if (!val) {
    return false
  }
  const type = typeof val
  return type === 'object' || type === 'function'
}

export function isString(val: any) {
  return typeof val === 'string'
}

export function isFunction(val: any) {
  return typeof val === 'function'
}

export function isDefined(val: any) {
  return val !== undefined
}

export function assertTruthy(
  expression: any,
  message: string,
  errorConstructor: ErrorConstructor = Error
) {
  if (!expression) {
    if (errorConstructor) {
      throw new errorConstructor(message)
    }
  }
}

export function asyncMap<T>(arr: T[], iteratee: (item: T) => Promise<any>) {
  return Promise.all(arr.map(iteratee))
}

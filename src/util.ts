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

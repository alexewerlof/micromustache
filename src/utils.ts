export function isObj(x: unknown): x is object {
  return x !== null && typeof x === 'object'
}

export function isFn<T extends Function>(x: unknown): x is T {
  return typeof x === 'function'
}

export function isStr(x: unknown, minLength = 0): x is string {
  return typeof x === 'string' && x.length >= minLength
}

export function isNum(x: unknown): x is number {
  return Number.isFinite(x as number)
}

export function isArr(x: unknown): x is unknown[] {
  return Array.isArray(x)
}

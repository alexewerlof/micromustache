export function isObj(x: any): x is object {
  return Boolean(x) && typeof x === 'object'
}

export function isFn<T>(x: any): x is T {
  return typeof x === 'function'
}

export function isStr(x: any, minLength = 0): x is string {
  return typeof x === 'string' && x.length >= minLength
}

export function isNum(x: any): x is number {
  return Number.isFinite(x)
}

export function isArr(x: any): x is any[] {
  return Array.isArray(x)
}

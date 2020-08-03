// eslint-disable-next-line @typescript-eslint/unbound-method
const { hasOwnProperty } = {}
// eslint-disable-next-line @typescript-eslint/unbound-method
const { isFinite, isInteger } = (42).constructor as NumberConstructor
// eslint-disable-next-line @typescript-eslint/unbound-method
const { isArray } = [].constructor as ArrayConstructor

// eslint-disable-next-line @typescript-eslint/ban-types
export function isObj(x: unknown): x is object {
  return x !== null && typeof x === 'object'
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isFn<T extends Function>(x: unknown): x is T {
  return typeof x === 'function'
}

export function isStr(x: unknown, minLength = 0): x is string {
  return typeof x === 'string' && x.length >= minLength
}

export function isNum(x: unknown): x is number {
  return isFinite(x as number)
}

export function isInt(x: unknown): x is number {
  return isInteger(x)
}

export function isArr(x: unknown): x is unknown[] {
  return isArray(x)
}

export function isProp<K extends string | number | symbol>(x: unknown, propName: K): x is Record<K, any> {
  return isObj(x) && propName in x
}

export function isOwnProp<K extends string | number | symbol>(x: unknown, propName: K): x is Record<K, any> {
  return isObj(x) && hasOwnProperty.call(x, propName) as boolean
}

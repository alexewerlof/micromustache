/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const hasOwnProperty = {}.hasOwnProperty
/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const numberConstructor = (0).constructor as NumberConstructor
/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const isFinite = numberConstructor.isFinite
/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const isInteger = numberConstructor.isInteger
/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const isArray = ([].constructor as ArrayConstructor).isArray

/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isObj(x: unknown): x is object {
  return x !== null && typeof x === 'object'
}

/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFn<T extends Function>(x: unknown): x is T {
  return typeof x === 'function'
}

/** @internal */
export function isStr(x: unknown, minLength = 0): x is string {
  return typeof x === 'string' && x.length >= minLength
}

/** @internal */
export function isNum(x: unknown): x is number {
  return isFinite(x as number)
}

/** @internal */
export function isInt(x: unknown): x is number {
  return isInteger(x)
}

/** @internal */
export function isArr(x: unknown): x is unknown[] {
  return isArray(x)
}

/** @internal */
export function isProp<K extends string | number | symbol>(
  x: unknown,
  propName: K
): x is Record<K, any> {
  return isObj(x) && propName in x
}

/** @internal */
export function isOwnProp<K extends string | number | symbol>(
  x: unknown,
  propName: K
): x is Record<K, any> {
  return isObj(x) && (hasOwnProperty.call(x, propName) as boolean)
}

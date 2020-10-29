/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const numberConstructor = (0).constructor as NumberConstructor
/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const isFinite = numberConstructor.isFinite
/** @internal */
/** @internal */
// eslint-disable-next-line @typescript-eslint/unbound-method
const isArray = ([].constructor as ArrayConstructor).isArray

/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isObj(x: unknown): x is object {
  return x !== null && typeof x === 'object'
}

/** @internal */
export function isStr(x: unknown, minLength = 0): x is string {
  return typeof x === 'string' && x.length >= minLength
}

/**
 * @internal
 * Checks that a given value is a finite positive number
 */
export function isPos(x: unknown): x is number {
  return isFinite(x as number) && 0 < (x as number)
}

/** @internal */
export const isArr: (x: unknown) => x is unknown[] = isArray

/** @internal */
export function isProp<K extends string | number | symbol>(
  x: unknown,
  propName: K
): x is Record<K, any> {
  return isObj(x) && propName in x
}

function errMsg(errConst: ErrorConstructor, fn: { name: string; }, msgArr: (string|number)[]): Error {
  return new errConst(`${fn.name}() ${msgArr.join(' ')}`)
}

/**
 * @internal
 * Creates a TypeError object
 * @param fn the function where the type error is going to be thrown from
 * @param msg the message
 */
export function typErr(fn: { name: string; }, msg: string, target: unknown): TypeError {
  return errMsg(TypeError, fn, ['expected', msg, 'but got a', typeof target,':', String(target)])
}

/**
 * @internal
 * Creates a SyntaxError object
 * @param fn the function where the type error is going to be thrown from
 * @param msg the message
 */
export function synErr(fn: { name: string; }, ...msg: (string|number)[]): SyntaxError {
  return errMsg(SyntaxError, fn, msg)
}

/**
 * @internal
 * Creates a RangeError object
 * @param fn the function where the type error is going to be thrown from
 * @param msg the message
 */
export function rngErr(fn: { name: string; }, ...msg: (string|number)[]): RangeError {
  return errMsg(RangeError, fn, msg)
}

/**
 * @internal
 * Creates a ReferenceError object
 * @param fn the function where the type error is going to be thrown from
 * @param msg the message
 */
export function refErr(fn: { name: string; }, ...msg: (string|number)[]): ReferenceError {
  return errMsg(ReferenceError, fn, msg)
}

/**
 * @internal
 * Checks if the provided value is an object and throws an error
 * Since this is a common pattern in the repo, this function saves a few lines from the distribution
 * @param fn the function that expects the options object
 * @param x supposedly an options value
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function optObj<T extends object>(fn: { name: string; }, x: unknown): T {
  if (!isObj(x)) {
    throw typErr(fn, 'an options object', x)
  }
  return x as T
}

/** @internal */
const hasOwnProperty = {}.hasOwnProperty
/** @internal */
const numberConstructor = (0).constructor as NumberConstructor
/** @internal */
const isFinite = numberConstructor.isFinite
/** @internal */
const isInteger = numberConstructor.isInteger
/** @internal */
const isArray = ([].constructor as ArrayConstructor).isArray

/** @internal */
export function isObj(x: unknown): x is object {
    return x !== null && typeof x === 'object'
}

/** @internal */
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
export function isProp<K extends string | number | symbol>(x: unknown, propName: K): x is Record<K, any> {
    return isObj(x) && propName in x
}

/** @internal */
export function isOwnProp<K extends string | number | symbol>(x: unknown, propName: K): x is Record<K, any> {
    return isObj(x) && (hasOwnProperty.call(x, propName) as boolean)
}

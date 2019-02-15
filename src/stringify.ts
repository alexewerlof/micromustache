import { isFunction } from './util'

export interface IStringifyOptions {
  /** an optional string to be used when the value is an unsupported type */
  invalidType?: string
  /** an optional string to be used when JSON.stringify fails */
  invalidObj?: string
}

const OBJECT_TO_STRING = Object.prototype.toString

/**
 * Converts a value to a string
 * If value is an object with a toString() function, that is used to convert it to string.
 * Otherwise JSON.stringify() is used
 * @param value - the value to be converted to string
 * @param options - the options from compile()
 * @returns - the value converted to string
 */
export function stringify(
  value: any,
  { invalidType = '', invalidObj = '{...}' }: IStringifyOptions = {}
): string {
  switch (typeof value) {
    case 'string':
      return value
    case 'boolean':
      return String(value)
    case 'number':
      if (value === Number.POSITIVE_INFINITY) {
        return '∞'
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return '-∞'
      }
      // including NaN
      return String(value)
    case 'object':
      // null is an object but is falsy. Swallow it.
      if (value === null) {
        return ''
      }
      if (isFunction(value.toString) && value.toString !== OBJECT_TO_STRING) {
        return value.toString()
      }
      try {
        return JSON.stringify(value)
      } catch (jsonError) {
        return invalidObj
      }
    case 'undefined':
      return ''
    default:
      // Anything else will be replaced with an empty string
      // For example: undefined, Symbol, etc.
      return invalidType
  }
}

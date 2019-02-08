import { isFunction } from './util'
import { IStringifyOptions } from './types'

const OBJECT_TO_STRING = Object.prototype.toString

/**
 * Converts a value to a string
 * If value is an object with a toString() function, that is used to convert it to string.
 * Otherwise JSON.stringify() is used
 * @param value
 * @param options the options from compile()
 * @returns the value converted to string
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

export function stringifyTagParams(
  strings: string[],
  values: any[],
  options?: IStringifyOptions
): string {
  const lastStringIndex = strings.length - 1
  const ret: string[] = new Array(lastStringIndex * 2 + 1)
  for (let i = 0; i < lastStringIndex; i++) {
    ret.push(strings[i])
    ret.push(stringify(values[i], options))
  }

  ret.push(strings[lastStringIndex])
  return ret.join('')
}

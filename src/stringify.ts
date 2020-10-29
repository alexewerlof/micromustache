import { ParsedTemplate, isParsedTemplate } from './parse'
import { optObj, isObj, newTypeError } from './utils'

/**
 * The options for the [[stringify]] function
 */
export interface StringifyOptions {
  /**
   * When set to a truthy value, rendering literally puts a 'null' or
   * 'undefined' for values that are `null` or `undefined`.
   * By default it swallows those values to be compatible with Mustache.
   */
  readonly explicit?: boolean
  /**
   * When set to a truthy value, it stringifies object values using `JSON.stringify()`
   */
  readonly json?: boolean
}

/**
 * Combines `subs` and `strings` to make a string
 */
export function stringify(
  parsedTemplate: ParsedTemplate<any>,
  options: StringifyOptions = {}
): string {
  if (!isParsedTemplate(parsedTemplate)) {
    throw newTypeError(stringify, 'a valid ParsedTemplate object', parsedTemplate)
  }

  const { explicit, json } = optObj<StringifyOptions>(stringify, options)
  const { strings, subs } = parsedTemplate
  const { length } = subs

  let ret = ''
  for (let i = 0; i < length; i++) {
    ret += strings[i]

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value: any = subs[i]

    if (explicit || (value !== null && value !== undefined)) {
      ret += json && isObj(value) ? JSON.stringify(value) : value
    }
  }

  ret += strings[length]

  return ret
}

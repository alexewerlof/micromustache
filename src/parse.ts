import { isStr, isArr, isObj, isNum, optObj } from './utils'
import { TAGS, MAX_PATH_LEN } from './defaults'

/**
 * The result of the parsing the template
 */
export interface ParsedTemplate<T> {
  /**
   * An array of constant strings extracted from the template
   */
  strings: string[]
  /**
   * An array corresponding to the substitute part of the template.
   *
   * [[parse]] gives an array of strings while [[compile]] gives an array of [[Ref]]s which
   * are also arrays. You can map these substitutes to whatever you want and then use [[render]] to
   * look up their value or just directly pass it to [[stringify]] to create a string from it.
   *
   * If there are no paths in the template, this will be an empty array.
   */
  subs: T[]
}

/**
 * The tags are an array of exactly two strings (that should be different and mutually exclusive)
 */
export type Tags = [string, string]

/**
 * The options for the [[parse]] function
 */
export interface ParseOptions {
  /**
   * Maximum allowed length for the trimmed path string.
   * Set this to a safe value to throw for paths that are longer than expected.
   *
   * @default defaults.MAX_PATH_LEN
   *
   * @example `path = 'a.b'`, depth = 3
   * @example `path = ' a.b '`, depth = 3 (trimmed path)
   * @example `path = 'a . b'`, depth = 5
   * @example `path = 'a.b.c'`, depth = 5
   * @example `path = 'a['b'].c'`, depth = 8
   */
  maxPathLen?: number
  /**
   * The string symbols that mark the opening and closing of a path in the template.
   * It should be an array of exactly two distinct strings otherwise an error is thrown.
   *
   * @default defaults.TAGS
   */
  tags?: Tags
}

export function isParsedTemplate(x: unknown): x is ParsedTemplate<any> {
  if (!isObj(x)) {
    return false
  }

  const { strings, subs } = x as ParsedTemplate<any>

  return isArr(strings) && isArr(subs) && strings.length === subs.length + 1
}

/**
 * This is an internal function that is used by [[parse]] to do the heavy lifting of going
 * through the template and parsing it to two arrays: one for strings and one for paths
 * @internal
 * @param template the template string
 * @param openTag the opening tag
 * @param closeTag the close tag
 * @param maxPathLen maximum path length
 */
function pureParser(
  template: string,
  openTag: string,
  closeTag: string,
  maxPathLen: number,
  where: string
): ParsedTemplate<string> {
  const openTagLen = openTag.length
  const closeTagLen = closeTag.length
  const templateLen = template.length

  let lastOpenTagIndex: number
  let lastCloseTagIndex = 0
  let currentIndex = 0

  // The result
  const strings: string[] = []
  const paths: string[] = []

  while (currentIndex < templateLen) {
    lastOpenTagIndex = template.indexOf(openTag, currentIndex)
    if (lastOpenTagIndex === -1) {
      break
    }

    const pathStartIndex = lastOpenTagIndex + openTagLen

    lastCloseTagIndex = template.indexOf(closeTag, pathStartIndex)

    if (lastCloseTagIndex === -1) {
      throw new SyntaxError(
        `${where} cannot find "${closeTag}" for the "${openTag}" at position ${lastOpenTagIndex} within ${maxPathLen} characters`
      )
    }

    const path = template.substring(pathStartIndex, lastCloseTagIndex)

    if (path.length > maxPathLen) {
      throw new SyntaxError(
        `${where} the path max length is configured to ${maxPathLen} but for "${path}" got ${path.length}`
      )
    }

    if (path.includes(openTag)) {
      throw new SyntaxError(
        `${where} found an unexpected "${openTag}" at position ${lastOpenTagIndex} in path "${path}"`
      )
    }

    paths.push(path)

    lastCloseTagIndex += closeTagLen
    strings.push(template.substring(currentIndex, lastOpenTagIndex))
    currentIndex = lastCloseTagIndex
  }

  strings.push(template.substring(lastCloseTagIndex))

  return { strings, subs: paths }
}

/**
 * Parses a template
 *
 * The result can be directly passed to the [[render]] or [[resolve]] functions
 * instead of the raw template string.
 *
 * @see https://github.com/userpixel/micromustache/wiki/Known-issues
 *
 * @throws `TypeError` if there's an issue with its inputs
 * @throws `SyntaxError` if there's an issue with the template
 *
 * @param template the template
 * @param openSym the string that marks the start of a path
 * @param closeSym the string that marks the start of a path
 * @returns the parsing result as an object
 */
export function parse(template: string, options: ParseOptions = {}): ParsedTemplate<string> {
  const where = 'parse()'

  if (!isStr(template)) {
    throw new TypeError(
      `${where} expected a string template. Got a ${typeof template}: ${template}`
    )
  }

  const { tags = TAGS, maxPathLen = MAX_PATH_LEN } = optObj<ParseOptions>(where, options)

  if (!isArr(tags) || tags.length !== 2) {
    throw TypeError(`${where} expected an array of two elements for tags. Got ${String(tags)}`)
  }

  const [openTag, closeTag] = tags

  if (
    !isStr(openTag, 1) ||
    !isStr(closeTag, 1) ||
    openTag === closeTag ||
    openTag.includes(closeTag) ||
    closeTag.includes(openTag)
  ) {
    throw new TypeError(
      `${where} expects 2 distinct non-empty strings which don't contain each other. Got "${openTag}" and "${closeTag}"`
    )
  }

  if (!isNum(maxPathLen) || maxPathLen <= 0) {
    throw new Error(`${where} expected a positive number for maxPathLen. Got ${maxPathLen}`)
  }

  return pureParser(template, openTag, closeTag, maxPathLen, where)
}

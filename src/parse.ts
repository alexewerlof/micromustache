import { isStr, isArr, isObj, isNum } from './utils'

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
   * [[parseTemplate]] gives an array of strings while [[compile]] gives an array of [[Ref]]s which
   * are also arrays. Furthermore, any transformation acts on this data structure and may put
   * whatever item types in this array.
   *
   * If there are no paths in the template, this will be an empty array.
   */
  subs: T[]
}

/**
 * The options that goes to the template parsing algorithm
 */
export interface ParseTemplateOptions {
  /**
   * Maximum allowed path. Set this to a safe value to prevent a bad template from blocking
   * the template parsing unnecessarily
   */
  maxPathLen?: number
  /**
   * The string symbols that mark the opening and closing of a path in the template.
   * It should be an array of exactly two distinct strings otherwise an error is thrown.
   * It defaults to `['{{', '}}']`
   */
  tags?: [string, string]
}

export function isParsedTemplate(x: unknown): x is ParsedTemplate<any> {
  if (!isObj(x)) {
    return false
  }
  const parsedTemplate = x as ParsedTemplate<any>
  return (
    isArr(parsedTemplate.strings) &&
    isArr(parsedTemplate.subs) &&
    parsedTemplate.strings.length === parsedTemplate.subs.length + 1
  )
}

/**
 * This is an internal function that is used by [[parseTemplate]] to do the heavy lifting of going
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
  maxPathLen: number
): ParsedTemplate<string> {
  const openTagLen = openTag.length
  const closeTagLen = closeTag.length
  const templateLen = template.length

  let lastOpenTagIndex: number
  let lastCloseTagIndex = 0
  let currentIndex = 0
  let path: string

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
        `Missing "${closeTag}" in the template for the "${openTag}" at position ${lastOpenTagIndex} within ${maxPathLen} characters`
      )
    }

    path = template.substring(pathStartIndex, lastCloseTagIndex).trim()

    const pathLen = path.length
    if (pathLen === 0) {
      throw new SyntaxError(`Unexpected "${closeTag}" tag found at position ${lastOpenTagIndex}`)
    }

    if (path.length > maxPathLen) {
      throw new SyntaxError(
        `The path is too long. Expected a maximum of ${maxPathLen} but got ${pathLen} for "${path}"`
      )
    }

    if (path.includes(openTag)) {
      throw new SyntaxError(
        `Path cannot have "${openTag}". But at position ${lastOpenTagIndex} got "${path}"`
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
 * The result can be directly passed to the [[render]], [[renderFn]] or [[renderFnAsync]] functions
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
export function parseTemplate(
  template: string,
  options: ParseTemplateOptions = {}
): ParsedTemplate<string> {
  if (!isStr(template)) {
    throw new TypeError(`The template parameter must be a string. Got a ${typeof template}`)
  }

  if (!isObj(options)) {
    throw new TypeError(`Options should be an object. Got a ${typeof options}`)
  }

  const { tags = ['{{', '}}'], maxPathLen = 1000 } = options

  if (!isArr(tags) || tags.length !== 2) {
    throw TypeError(`tags should be an array of two elements. Got ${String(tags)}`)
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
      `The open and close symbols should be two distinct non-empty strings which don't contain each other. Got "${openTag}" and "${closeTag}"`
    )
  }

  if (!isNum(maxPathLen) || maxPathLen <= 0) {
    throw new Error(`Expected a positive number for maxPathLen. Got ${maxPathLen}`)
  }

  return pureParser(template, openTag, closeTag, maxPathLen)
}

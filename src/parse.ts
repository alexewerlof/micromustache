import { isStr, isArr, isObj, isPos, optObj, typErr, synErr, rngErr } from './utils'
import { TAGS, MAX_PATH_LEN, MAX_TEMPLATE_LEN, MAX_PATH_COUNT } from './defaults'

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
   * You can map these substitutes to whatever you want and then use [[render]] to
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
   * Maximum length for the template string (inclusive)
   *
   * @default MAX_TEMPLATE_LEN
   */
  readonly maxTemplateLen?: number
  /**
   * Maximum allowed length for the trimmed path string (inclusive).
   * Set this to a safe value to throw for paths that are longer than expected.
   *
   * @default MAX_PATH_LEN
   *
   * @example `{{a.b}}` has a length of 3
   * @example `{{ a.b }}` has a length of 3 (trimmed path)
   * @example `{{a . b}}` has a length of 5
   * @example `{{a.b.c}}` has a length of 5
   * @example `{{a['b'].c}}` has a length of 8
   */
  readonly maxPathLen?: number
  /**
   * Maximum number of paths in a template (inclusive)
   *
   * @default MAX_PATH_COUNT
   *
   * @example `Hi {{name}}` has 1 path
   * @example `Hi {{fName}} {{lName}}` has 2 paths
   * @example `Hi {{person.name}}` has 1 path
   */
  readonly maxPathCount?: number
  /**
   * The string symbols that mark the opening and closing of a path in the template.
   * It should be an array of exactly two distinct strings otherwise an error is thrown.
   *
   * @default TAGS
   */
  readonly tags?: Tags
}

/** @internal */
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
  maxPathCount: number,
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
      throw synErr(
        parse, 'cannot find', closeTag, 'matching the', openTag, 'at position', lastOpenTagIndex
      )
    }

    const path = template.substring(pathStartIndex, lastCloseTagIndex)

    if (path.length > maxPathLen) {
      throw synErr(
        parse, 'encountered the path', path, 'at position', pathStartIndex, 'which is',
        path.length - maxPathLen
        , 'characters longer than the configured limit of', maxPathLen
      )
    }

    if (path.includes(openTag)) {
      throw synErr(
        parse, 'found an unexpected', openTag, 'in', path, 'at position',
        pathStartIndex + lastOpenTagIndex
      )
    }

    if (paths.length >= maxPathCount) {
      throw rngErr(
        parse,
        'the max number of paths is configured to be', maxPathCount, 'but we have already reached that limit'
      )
    }

    paths.push(path)

    lastCloseTagIndex += closeTagLen
    const beforePath = template.substring(currentIndex, lastOpenTagIndex)
    const danglingCloseTagIndex = beforePath.indexOf(closeTag)
    if (danglingCloseTagIndex !== -1) {
      throw synErr(
        parse,'encountered a dangling', closeTag, 'at position', danglingCloseTagIndex
      )
    }

    strings.push(beforePath)
    currentIndex = lastCloseTagIndex
  }

  const rest = template.substring(lastCloseTagIndex)
  const danglingTagIndex = rest.indexOf(closeTag)

  if (danglingTagIndex === -1) {
    strings.push(rest)
    return { strings, subs: paths }
  }

  throw synErr(
    parse, 'encountered a dangling', closeTag, 'at position',
    danglingTagIndex + lastCloseTagIndex
  )
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
 * @throws `RangeError` if maxPathLen is invalid
 * @throws `SyntaxError` if there's an issue with the template
 *
 * @param template the template
 * @param openSym the string that marks the start of a path
 * @param closeSym the string that marks the start of a path
 * @returns the parsing result as an object
 */
export function parse(template: string, options: ParseOptions = {}): ParsedTemplate<string> {
  if (!isStr(template)) {
    throw typErr(parse, 'a string template', template)
  }

  const {
    tags = TAGS,
    maxPathLen = MAX_PATH_LEN,
    maxTemplateLen = MAX_TEMPLATE_LEN,
    maxPathCount = MAX_PATH_COUNT,
  } = optObj<ParseOptions>(parse, options)

  if (template.length > maxTemplateLen) {
    throw rngErr(
      parse, 'got a template that is', template.length - maxTemplateLen,
      'characters longer than the configured limit of', maxTemplateLen
    )
  }

  if (!isArr(tags) || tags.length !== 2) {
    throw typErr(parse, 'an array of two elements for tags', tags)
  }

  const [openTag, closeTag] = tags

  if (
    !isStr(openTag, 1) ||
    !isStr(closeTag, 1) ||
    openTag === closeTag ||
    openTag.includes(closeTag) ||
    closeTag.includes(openTag)
  ) {
    throw typErr(parse, '2 distinct non-empty strings which do not contain each other', tags)
  }

  if (!isPos(maxPathLen)) {
    throw rngErr(parse, 'expected a positive number for maxPathLen but got', maxPathLen)
  }

  return pureParser(template, openTag, closeTag, maxPathLen, maxPathCount)
}

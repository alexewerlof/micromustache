import { isStr, isArr, isObj, isNum } from './utils'

export interface Tokens {
  /** An array of constant strings extracted from the template */
  readonly strings: string[]
  /** An array of path strings extracted from the template */
  readonly paths: string[]
}

/**
 * The options that goes to the tokenization algorithm
 */
export interface TokenizeOptions {
  /**
   * Maximum allowed path. Set this to a safe value to prevent a bad template from blocking
   * the tokenization unnecessarily
   */
  maxPathLen?: number
  /**
   * The string symbols that mark the opening and closing of a path in the template.
   * It should be an array of exactly two distinct strings otherwise an error is thrown.
   * It defaults to `['{{', '}}']`
   */
  tags?: [string, string]
}

/**
 * Parses a template and returns the tokens in an object.
 *
 * @throws `TypeError` if there's an issue with its inputs
 * @throws `SyntaxError` if there's an issue with the template
 *
 * @param template the template
 * @param openSym the string that marks the start of a path
 * @param closeSym the string that marks the start of a path
 * @returns the resulting tokens as an object that has strings and paths
 */
export function tokenize(template: string, options: TokenizeOptions = {}): Tokens {
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

  const openTagLen = openTag.length
  const closeTagLen = closeTag.length

  let lastOpenTagIndex: number
  let lastCloseTagIndex = 0
  let currentIndex = 0
  let path: string

  // The result
  const strings: string[] = []
  const paths: string[] = []

  while (currentIndex < template.length) {
    lastOpenTagIndex = template.indexOf(openTag, currentIndex)
    if (lastOpenTagIndex === -1) {
      break
    }

    const refStartIndex = lastOpenTagIndex + openTagLen

    lastCloseTagIndex = template.substr(refStartIndex, maxPathLen + closeTagLen).indexOf(closeTag)

    if (lastCloseTagIndex === -1) {
      throw new SyntaxError(
        `Missing "${closeTag}" in the template for the "${openTag}" at position ${lastOpenTagIndex} within ${maxPathLen} characters`
      )
    }

    lastCloseTagIndex += refStartIndex

    path = template.substring(refStartIndex, lastCloseTagIndex).trim()

    if (path.length === 0) {
      throw new SyntaxError(`Unexpected "${closeTag}" tag found at position ${lastOpenTagIndex}`)
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

  return { strings, paths }
}

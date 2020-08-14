import { isStr, isArr, isObj, isNum } from './utils'

export interface Tokens {
  /** An array of constant strings */
  readonly strings: string[]
  /** An array of variable names */
  readonly varNames: string[]
}

/**
 * The options that goes to the tokenization algorithm
 */
export interface TokenizeOptions {
  /**
   * Maximum allowed variable name. Set this to a safe value to prevent a bad template from blocking
   * the tokenization unnecessarily
   */
  maxVarNameLength?: number
  /**
   * The string symbols that mark the opening and closing of a variable name in the template.
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
 * @param openSym the string that marks the start of a variable name
 * @param closeSym the string that marks the start of a variable name
 * @returns the resulting tokens as an object that has strings and variable names
 */
export function tokenize(template: string, options: TokenizeOptions = {}): Tokens {
  if (!isStr(template)) {
    throw new TypeError(`The template parameter must be a string. Got a ${typeof template}`)
  }

  if (!isObj(options)) {
    throw new TypeError(`Options should be an object. Got a ${typeof options}`)
  }

  const { tags = ['{{', '}}'], maxVarNameLength = 1000 } = options

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
      `The open and close symbols should be two distinct non-empty strings. Got "${openTag}" and "${closeTag}"`
    )
  }

  if (!isNum(maxVarNameLength) || maxVarNameLength <= 0) {
    throw new Error(`Expected a positive number for maxVarNameLength. Got ${maxVarNameLength}`)
  }

  const openTagLen = openTag.length
  const closeTagLen = closeTag.length

  let lastOpenTagIndex: number
  let lastCloseTagIndex = 0
  let currentIndex = 0
  let varName: string

  // The result
  const strings: string[] = []
  const varNames: string[] = []

  while (currentIndex < template.length) {
    lastOpenTagIndex = template.indexOf(openTag, currentIndex)
    if (lastOpenTagIndex === -1) {
      break
    }

    const varNameStartIndex = lastOpenTagIndex + openTagLen

    lastCloseTagIndex = template
      .substr(varNameStartIndex, maxVarNameLength + closeTagLen)
      .indexOf(closeTag)

    if (lastCloseTagIndex === -1) {
      throw new SyntaxError(
        `Missing "${closeTag}" in the template for the "${openTag}" at position ${lastOpenTagIndex} within ${maxVarNameLength} characters`
      )
    }

    lastCloseTagIndex += varNameStartIndex

    varName = template.substring(varNameStartIndex, lastCloseTagIndex).trim()

    if (varName.length === 0) {
      throw new SyntaxError(`Unexpected "${closeTag}" tag found at position ${lastOpenTagIndex}`)
    }

    if (varName.includes(openTag)) {
      throw new SyntaxError(
        `Variable names cannot have "${openTag}". But at position ${lastOpenTagIndex}. Got "${varName}"`
      )
    }

    varNames.push(varName)

    lastCloseTagIndex += closeTagLen
    strings.push(template.substring(currentIndex, lastOpenTagIndex))
    currentIndex = lastCloseTagIndex
  }

  strings.push(template.substring(lastCloseTagIndex))

  return { strings, varNames }
}

import { isStr, isArr, isObj, isNum } from './utils'

export interface ITokens {
  /** An array of constant strings */
  readonly strings: string[]
  /** An array of variable names */
  readonly varNames: string[]
}

/**
 * Declares the open and close tag respectively
 */
export type ITags = [string, string]

/**
 * The options that goes to the tokenization algorithm
 */
export interface ITokenizeOptions {
  /**
   * Maximum allowed variable name. Set this to a safe value to prevent a bad template from blocking
   * the tokenization unnecessarily
   */
  maxVarNameLength?: number
  /**
   * The string symbols that mark the opening and closing of a variable name in
   * the template.
   * It defaults to `['{{', '}}']`
   */
  tags?: ITags
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
export function tokenize(template: string, options: ITokenizeOptions = {}): ITokens {
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

  const [openSym, closeSym] = tags

  if (!isStr(openSym, 1) || !isStr(closeSym, 1) || openSym === closeSym) {
    throw new TypeError(
      `The open and close symbols should be two distinct non-empty strings. Got "${openSym}" and "${closeSym}"`
    )
  }

  if (!isNum(maxVarNameLength) || maxVarNameLength <= 0) {
    throw new Error(`Expected a positive number for maxVarNameLength. Got ${maxVarNameLength}`)
  }

  const openSymLen = openSym.length
  const closeSymLen = closeSym.length

  let openIndex: number
  let closeIndex = 0
  let varName: string
  const strings: string[] = []
  const varNames: string[] = []
  let currentIndex = 0

  while (currentIndex < template.length) {
    openIndex = template.indexOf(openSym, currentIndex)
    if (openIndex === -1) {
      break
    }

    const varNameStartIndex = openIndex + openSymLen

    closeIndex = template
      .substr(varNameStartIndex, maxVarNameLength + closeSymLen)
      .indexOf(closeSym)

    if (closeIndex === -1) {
      throw new SyntaxError(
        `Missing "${closeSym}" in the template for the "${openSym}" at position ${openIndex}`
      )
    }

    closeIndex += varNameStartIndex

    varName = template.substring(varNameStartIndex, closeIndex).trim()

    if (varName.length === 0) {
      throw new SyntaxError(`Unexpected "${closeSym}" tag found at position ${openIndex}`)
    }

    if (varName.includes(openSym)) {
      throw new SyntaxError(
        `Variable names cannot have "${openSym}". But at position ${openIndex}. Got "${varName}"`
      )
    }

    varNames.push(varName)

    closeIndex += closeSymLen
    strings.push(template.substring(currentIndex, openIndex))
    currentIndex = closeIndex
  }

  strings.push(template.substring(closeIndex))

  return { strings, varNames }
}

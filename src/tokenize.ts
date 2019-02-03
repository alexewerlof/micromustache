import { assertTruthy, isString, isObject } from './util'
import { ITokenizeOptions, TokenType } from './types'
import { toPath } from './to-path'

export class NameToken {
  private pathsCache: string[]

  constructor(public readonly varName: string) {}

  get paths() {
    if (!this.pathsCache) {
      this.pathsCache = toPath(this.varName as string)
    }
    return this.pathsCache
  }
}

/**
 * Tokenize the template string and return an array of strings and
 * functions ready for the compiler to go through them.
 * This function could use regular expressions but using simpler searches is faster.
 *
 * @param template - the template
 * @param options - the options form compile()
 * @returns the resulting string
 */
export function tokenize(
  template: string,
  options: ITokenizeOptions = {}
): TokenType[] {
  assertTruthy(isString(template), `Template must be a string. Got ${template}`)
  assertTruthy(
    isObject(options),
    `When a options are provided, it should be an object. Got ${options}`
  ) // TODO TypeError
  const { openSymbol = '{{', closeSymbol = '}}' } = options
  assertTruthy(
    openSymbol !== closeSymbol,
    `Open and close symbol can't be the same ${openSymbol}`
  )

  const openSymbolLength = openSymbol.length
  const closeSymbolLength = closeSymbol.length
  let openIndex: number = -1
  let closeIndex: number = -1
  let before: string
  let varName: string
  const ret: TokenType[] = []
  let currentIndex = -openSymbolLength
  while (currentIndex < template.length) {
    openIndex = template.indexOf(openSymbol, currentIndex)
    if (openIndex === -1) {
      break
    }
    closeIndex = template.indexOf(closeSymbol, openIndex)
    if (closeIndex === -1) {
      throw new SyntaxError(
        `An ${openSymbol} found without ${closeSymbol} in ${template}`
      )
    }
    varName = template
      .substring(openIndex + openSymbolLength, closeIndex)
      .trim()
    if (varName.includes(openSymbol) || varName.includes(closeSymbol)) {
      throw new SyntaxError(`Invalid variable name ${varName} in ${template}`)
    }
    closeIndex += closeSymbolLength
    before = template.substring(currentIndex, openIndex)
    currentIndex = closeIndex

    if (before !== '') {
      if (before.includes(openSymbol) || before.includes(closeSymbol)) {
        throw new SyntaxError(
          `Invalid open and close match at ${before} in ${template}`
        )
      }
      ret.push(before)
    }
    if (varName !== '') {
      ret.push(new NameToken(varName))
    }
  }
  if (closeIndex !== template.length) {
    const rest = template.substring(closeIndex)
    if (rest.indexOf(closeSymbol) !== -1) {
      throw new SyntaxError(
        `A closing symbol found without an opening at ${rest} in ${template}`
      )
    }
    ret.push(rest)
  }
  return ret
}

import { assertTruthy, isString, isObject } from './util'
import { ITokenizeOptions, TokenType, TagInput } from './types'
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

// TODO: support open and close symbols that are the same. Coldfusion requires it: https://en.wikipedia.org/wiki/String_interpolation
// TODO: Support escaping characters
// TODO: Support word boundry for closeSymbol
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
): TagInput<string> {
  assertTruthy(isString(template), `Template must be a string. Got ${template}`)
  assertTruthy(
    isObject(options),
    `When a options are provided, it should be an object. Got ${options}`,
    TypeError
  )
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
  const strings: string[] = []
  const values: string[] = []
  let currentIndex = -openSymbolLength
  while (currentIndex < template.length) {
    openIndex = template.indexOf(openSymbol, currentIndex)
    if (openIndex === -1) {
      break
    }

    closeIndex = template.indexOf(closeSymbol, openIndex)
    assertTruthy(
      closeIndex !== -1,
      `Missing ${closeSymbol} in template expression`,
      SyntaxError
    )

    varName = template
      .substring(openIndex + openSymbolLength, closeIndex)
      .trim()

    assertTruthy(
      !varName.includes(openSymbol),
      `Missing ${closeSymbol} in template expression`,
      SyntaxError
    )

    assertTruthy(varName.length, `Unexpected token ${closeSymbol}`, SyntaxError)
    values.push(varName)

    closeIndex += closeSymbolLength
    before = template.substring(currentIndex, openIndex)
    strings.push(before)

    currentIndex = closeIndex
  }

  // if (closeIndex !== template.length) {
  const rest = template.substring(currentIndex)
  strings.push(rest)

  return { strings, values }
}

export function convertValuesToNameTokens(
  input: TagInput<string>
): TagInput<NameToken> {
  const { strings } = input
  const values = input.values.map(varName => new NameToken(varName))
  return { strings, values }
}

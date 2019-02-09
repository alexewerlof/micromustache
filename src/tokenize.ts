import { assertTruthy, isString, isObject, guessCloseSymbol } from './util'
import { toPath } from './to-path'

export type TokenType = NameToken | string

export interface ITagInput<T> {
  strings: string[]
  values: T[]
}

export type Template = string | ITagInput<string>

export type TagFn<T> = (strings: string[], ...values: any) => T

export interface IParseOptions {
  /** the string that indicates opening a variable interpolation expression */
  openSymbol?: string
  /** the string that indicates closing a variable interpolation expression */
  closeSymbol?: string
}

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
// TODO: Support word boundary for closeSymbol
// TODO: Support nested markup like a[b.foo]
/**
 * Parse a string and returns an array of variable names and non-processing strings.
 * functions ready for the compiler to go through them.
 * This function could use regular expressions but using simpler searches is faster.
 *
 * @param template - the template
 * @param options - the options form compile()
 * @returns - the resulting string
 */
export function parseString(
  template: string,
  options: IParseOptions = {}
): ITagInput<string> {
  assertTruthy(isString(template), `Template must be a string. Got ${template}`)
  assertTruthy(
    isObject(options),
    `When a options are provided, it should be an object. Got ${options}`,
    TypeError
  )
  const { openSymbol = '{{' } = options
  const { closeSymbol = guessCloseSymbol(openSymbol) } = options

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

  const rest = template.substring(currentIndex)
  strings.push(rest)

  return { strings, values }
}

export function format<T>(
  strings: string[],
  values: any[],
  valueToString: (value: T) => string
): string {
  const lastStringIndex = strings.length - 1
  const ret: string[] = new Array(lastStringIndex * 2 + 1)
  for (let i = 0; i < lastStringIndex; i++) {
    ret.push(strings[i])
    ret.push(valueToString(values[i]))
  }

  ret.push(strings[lastStringIndex])
  return ret.join('')
}

export function tokenize(
  template: Template,
  options?: IParseOptions
): ITagInput<NameToken> {
  const tagInput: ITagInput<string> = isString(template)
    ? parseString(template, options)
    : template
  const values = tagInput.values.map(varName => new NameToken(varName))
  return { strings: tagInput.strings, values }
}

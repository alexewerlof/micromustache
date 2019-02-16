import {
  assertTruthy,
  isString,
  isObject,
  guessCloseSymbol,
  assertSyntax,
  assertType
} from './util'

export interface ITagInput {
  strings: string[]
  values: string[]
}

export type TagFn<T> = (strings: string[], ...values: any) => T

export interface IParseOptions {
  /** the string that indicates opening a variable interpolation expression */
  openSymbol?: string
  /** the string that indicates closing a variable interpolation expression */
  closeSymbol?: string
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
export function tokenize(
  template: string,
  options: IParseOptions = {}
): ITagInput {
  assertType(isString(template), 'Template must be a string. Got', template)
  assertType(
    isObject(options),
    'When a options are provided, it should be an object. Got',
    options
  )
  const { openSymbol = '{{' } = options
  const { closeSymbol = guessCloseSymbol(openSymbol) } = options

  assertTruthy(
    openSymbol !== closeSymbol,
    `Open and close symbol can't be the same ${openSymbol}`
  )

  const openSymbolLength = openSymbol.length
  const closeSymbolLength = closeSymbol.length
  let openIndex: number
  let closeIndex: number = 0
  let before: string
  let varName: string
  const strings: string[] = []
  const values: string[] = []

  for (
    let currentIndex = 0;
    currentIndex < template.length;
    currentIndex = closeIndex
  ) {
    openIndex = template.indexOf(openSymbol, currentIndex)
    if (openIndex === -1) {
      break
    }

    closeIndex = template.indexOf(closeSymbol, openIndex)
    assertSyntax(
      closeIndex !== -1,
      'Missing',
      closeSymbol,
      'in template expression'
    )

    varName = template
      .substring(openIndex + openSymbolLength, closeIndex)
      .trim()

    assertSyntax(
      !varName.includes(openSymbol),
      'Missing',
      closeSymbol,
      'in template expression'
    )

    assertSyntax(varName.length, 'Unexpected token', closeSymbol)
    values.push(varName)

    closeIndex += closeSymbolLength
    before = template.substring(currentIndex, openIndex)
    strings.push(before)
  }

  const rest = template.substring(closeIndex)
  strings.push(rest)

  return { strings, values }
}

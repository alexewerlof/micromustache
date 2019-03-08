import { isString, assertSyntax, assertType } from './util'

export interface ITokens {
  strings: string[]
  varNames: string[]
}

const OPEN_SYM = '{{'
const CLOSE_SYM = '}}'
const OPEN_SYM_LEN = OPEN_SYM.length
const CLOSE_SYM_LEN = CLOSE_SYM.length

/**
 * Parse a string and returns an array of variable names and non-processing strings.
 * functions ready for the compiler to go through them.
 * This function could use regular expressions but using simpler searches is faster.
 *
 * @param template - the template
 * @returns - the resulting tokens as an object that has strings and variable names
 */
export function tokenize(template: string): ITokens {
  assertType(isString(template), 'Template must be a string. Got', template)

  let openIndex: number
  let closeIndex: number = 0
  let before: string
  let varName: string
  const strings: string[] = []
  const varNames: string[] = []

  for (
    let currentIndex = 0;
    currentIndex < template.length;
    currentIndex = closeIndex
  ) {
    openIndex = template.indexOf(OPEN_SYM, currentIndex)
    if (openIndex === -1) {
      break
    }

    closeIndex = template.indexOf(CLOSE_SYM, openIndex)
    assertSyntax(
      closeIndex !== -1,
      'Missing',
      CLOSE_SYM,
      'in template expression',
      template
    )

    varName = template.substring(openIndex + OPEN_SYM_LEN, closeIndex).trim()

    assertSyntax(
      !varName.includes(OPEN_SYM),
      'Missing',
      CLOSE_SYM,
      'in template expression',
      template
    )

    assertSyntax(varName.length, 'Unexpected token', CLOSE_SYM)
    varNames.push(varName)

    closeIndex += CLOSE_SYM_LEN
    before = template.substring(currentIndex, openIndex)
    strings.push(before)
  }

  const rest = template.substring(closeIndex)
  strings.push(rest)

  return { strings, varNames }
}

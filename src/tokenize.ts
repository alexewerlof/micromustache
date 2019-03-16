import { isString } from './util'

export interface ITokens {
  strings: string[]
  varNames: string[]
}

/**
 * Parse a template and returns the tokens in an object.
 *
 * @throws TypeError if there's an issue with its inputs
 * @throws SyntaxError if there's an issue with the template
 *
 * @param template - the template
 * @param openSym - the string that marks the start of a variable name
 * @param closeSym - the string that marks the start of a variable name
 * @returns - the resulting tokens as an object that has strings and variable names
 */
export function tokenize(
  template: string,
  openSym = '{{',
  closeSym = '}}'
): ITokens {
  if (!isString(openSym, true)) {
    throw new TypeError(
      'The openSym parameter must be a string. Got ' + openSym
    )
  }
  if (!isString(closeSym, true)) {
    throw new TypeError(
      'The closeSym parameter must be a string. Got ' + closeSym
    )
  }

  const openSymLen = openSym.length
  const closeSymLen = closeSym.length

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
    openIndex = template.indexOf(openSym, currentIndex)
    if (openIndex === -1) {
      break
    }

    closeIndex = template.indexOf(closeSym, openIndex)
    if (closeIndex === -1) {
      throw new SyntaxError(
        'Missing ' + closeSym + ' in the template expression ' + template
      )
    }

    varName = template.substring(openIndex + openSymLen, closeIndex).trim()

    if (varName.includes(openSym)) {
      throw new SyntaxError(
        'Missing ' + closeSym + ' in the template expression ' + varName
      )
    }

    if (!varName.length) {
      throw new SyntaxError('Unexpected token ' + closeSym)
    }
    varNames.push(varName)

    closeIndex += closeSymLen
    before = template.substring(currentIndex, openIndex)
    strings.push(before)
  }

  const rest = template.substring(closeIndex)
  strings.push(rest)

  return { strings, varNames }
}

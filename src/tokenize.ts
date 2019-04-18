export interface ITokens {
  readonly strings: string[]
  readonly varNames: string[]
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
  if (typeof openSym !== 'string' || openSym.length === 0) {
    throw new TypeError(
      'The openSym parameter must be a string. Got ' + openSym
    )
  }
  if (typeof closeSym !== 'string' || closeSym.length === 0) {
    throw new TypeError(
      'The closeSym parameter must be a string. Got ' + closeSym
    )
  }
  if (openSym === closeSym) {
    throw new TypeError(
      'The open and close syntax cannot be the same: "' + openSym + '"'
    )
  }

  const openSymLen = openSym.length
  const closeSymLen = closeSym.length

  let openIndex: number
  let closeIndex: number = 0
  let varName: string
  const strings: string[] = []
  const varNames: string[] = []
  let currentIndex = 0

  while (currentIndex < template.length) {
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

    if (varName.length === 0) {
      throw new SyntaxError('Unexpected token ' + closeSym)
    }

    if (varName.includes(openSym)) {
      throw new SyntaxError(
        'Variable names cannot have ' + openSym + ' ' + varName
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

export interface ITokens {
  strings: string[]
  varNames: string[]
}

const escape = '/'

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

  const openSymLen = openSym.length
  const closeSymLen = closeSym.length
  const escapedOpen = escape + openSym

  let openIndex: number
  let closeIndex: number = 0
  let varName: string
  const strings: string[] = []
  const varNames: string[] = []
  let currentIndex = 0
  let foundEscapedOpen = false

  function pushToStrings(str: string) {
    const sanitizedStr = foundEscapedOpen
      ? str.replace(escapedOpen, openSym)
      : str
    strings.push(sanitizedStr)
  }

  while (currentIndex < template.length) {
    openIndex = template.indexOf(openSym, currentIndex)
    if (openIndex === -1) {
      break
    }

    if (template.charAt(openIndex - 1) === escape) {
      currentIndex = openIndex + openSymLen
      foundEscapedOpen = true
      continue
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
        'Missing ' + closeSym + ' in the template expression ' + varName
      )
    }

    varNames.push(varName)

    closeIndex += closeSymLen
    pushToStrings(template.substring(currentIndex, openIndex))
    currentIndex = closeIndex
  }

  pushToStrings(template.substring(closeIndex))

  return { strings, varNames }
}

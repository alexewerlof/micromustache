export type PropNames = string[]

/**
 * The number of different varNames that will be cached.
 * If a varName is cached, the actual parsing algorithm will not be called
 * which significantly improves performance.
 * However, this cache is size-limited to prevent degrading the user's software
 * over a period of time.
 * If the cache is full, we start removing older varNames one at a time.
 */
const cacheSize = 100
const quoteChars = '\'"`'

function isQuote(str: string): boolean {
  return quoteChars.indexOf(str) !== -1
}

/**
 * Trim and remove the starting dot if it exists
 * @param propName - the raw property name like `".a"` or `" . a"`
 * @return - the input trimmed and without a leading dot
 */
function normalizePropName(propName: string) {
  const pName = propName.trim()
  if (pName.startsWith('.')) {
    return pName.substr(1).trim()
  }
  return pName
}

/**
 * Removes the quotes from a string and returns it.
 * @throws if the quotation symbols don't match or one is missing
 * @param propName - an string with quotations
 * @returns - the input with its quotes removed
 */
function unquote(propName: string): string {
  propName.trim()
  // in our algorithms key is always a string and never only a string of spaces
  const firstChar = propName.charAt(0)
  const lastChar = propName.substr(-1)
  if (isQuote(firstChar) || isQuote(lastChar)) {
    if (propName.length < 2 || firstChar !== lastChar) {
      throw new SyntaxError('Invalid or unexpected token ' + propName)
    }
    return propName.substring(1, propName.length - 1)
  }

  // Normalize leading plus from numerical indices
  if (firstChar === '+') {
    return propName.substr(1)
  }

  return propName
}

function pushPropName(propNames: string[], propName: string) {
  propName = normalizePropName(propName)
  if (propName !== '') {
    const propNameParts = propName.split('.')
    for (const propNamePart of propNameParts) {
      const trimmedPropName = propNamePart.trim()
      if (trimmedPropName === '') {
        throw new SyntaxError(
          'Unexpected token. Encountered empty prop name when parsing ' +
            propName
        )
      }
      propNames.push(trimmedPropName)
    }
  }
}

/**
 * Breaks a variable name to an array of strings that can be used to get a
 * particular value from an object
 * @param varName - the variable name as it occurs in the template.
 * For example `a["b"].c`
 * @returns - an array of property names that can be used to get a particular
 * value.
 * For example `['a', 'b', 'c']`
 */
export function toPath(varName: string): PropNames {
  if (typeof varName !== 'string') {
    throw new TypeError(
      'The varName parameter must be a string but. Got ' + varName
    )
  }

  varName = normalizePropName(varName)

  let openBracketIndex: number
  let closeBracketIndex: number = 0
  let beforeBracket: string
  let propName: string

  const propNames: PropNames = []

  for (
    let currentIndex = 0;
    currentIndex < varName.length;
    currentIndex = closeBracketIndex
  ) {
    openBracketIndex = varName.indexOf('[', currentIndex)
    if (openBracketIndex === -1) {
      break
    }

    closeBracketIndex = varName.indexOf(']', openBracketIndex)
    if (closeBracketIndex === -1) {
      throw new SyntaxError('Missing ] in varName ' + varName)
    }

    propName = varName.substring(openBracketIndex + 1, closeBracketIndex).trim()

    if (propName.includes('[')) {
      throw new SyntaxError('Missing ] in varName ' + varName)
    }

    closeBracketIndex++
    beforeBracket = varName.substring(currentIndex, openBracketIndex)
    pushPropName(propNames, beforeBracket)

    if (!propName.length) {
      throw new SyntaxError('Unexpected token ]')
    }
    propNames.push(unquote(propName))
  }

  const rest = varName.substring(closeBracketIndex)
  pushPropName(propNames, rest)

  return propNames
}

// TODO: refactor so we can call toPath.cached(varName) instead
export class CachedToPath {
  private toPathCache: {
    [varName: string]: PropNames
  }

  private cachedVarNames: string[]
  private oldestIndex: number

  constructor(private size: number) {
    this.clear()
  }

  public clear() {
    this.oldestIndex = 0
    this.toPathCache = {}
    this.cachedVarNames = new Array(this.size)
  }

  /**
   * This is just a faster version of `toPath()`
   */
  public toPath(varName: string): PropNames {
    let result = this.toPathCache[varName]
    if (!result) {
      result = this.toPathCache[varName] = toPath(varName)
      const keyToDelete = this.cachedVarNames[this.oldestIndex]
      if (keyToDelete !== undefined) {
        delete this.toPathCache[keyToDelete]
      }
      this.cachedVarNames[this.oldestIndex] = varName
      this.oldestIndex++
      this.oldestIndex %= this.size
    }
    return result
  }
}

export const cached = new CachedToPath(cacheSize)

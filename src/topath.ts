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
 * @param propName - the raw path like `".a"` or `" . a"`
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
 * @param str - an string with quotations
 * @returns - the input with its quotes removed
 */
export function unquote(str: string): string {
  const key = str.trim()
  // in our algorithms key is always a string and never only a string of spaces
  const firstChar = key.charAt(0)
  const lastChar = key.substr(-1)
  if (isQuote(firstChar) || isQuote(lastChar)) {
    if (key.length < 2 || firstChar !== lastChar) {
      throw new SyntaxError('Invalid or unexpected token ' + key)
    }
    return key.substring(1, key.length - 1)
  }

  // Normalize leading plus from numerical indices
  if (firstChar === '+') {
    return key.substr(1)
  }

  return key
}

function pushString(str: string, strArr: string[]) {
  str = normalizePropName(str)
  if (str !== '') {
    const splitPath = str.split('.')
    for (const p of splitPath) {
      const sTrimmed = p.trim()
      if (sTrimmed === '') {
        throw new SyntaxError(
          'Unexpected token. Encountered empty path when parsing ' + str
        )
      }
      strArr.push(sTrimmed)
    }
  }
}

/**
 * Breaks a variable name to an array of strings that can be used to get a
 * particular value from an object
 * @param varName - the variable name as it occurs in the template.
 * For example `a.b.c`
 * @returns - an array of property names that can be used to get a particular
 * value.
 * For example `['a', 'b', 'c']`
 */
export function toPath(varName: string): PropNames {
  if (typeof varName !== 'string') {
    throw new TypeError('Path must be a string but. Got ' + varName)
  }

  varName = normalizePropName(varName)

  let openBracketIndex: number
  let closeBracketIndex: number = 0
  let beforeBracket: string
  let propName: string

  const ret: PropNames = []

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
      throw new SyntaxError('Missing ] in path ' + varName)
    }

    propName = varName.substring(openBracketIndex + 1, closeBracketIndex).trim()

    if (propName.includes('[')) {
      throw new SyntaxError('Missing ] in path ' + varName)
    }

    closeBracketIndex++
    beforeBracket = varName.substring(currentIndex, openBracketIndex)
    pushString(beforeBracket, ret)

    if (!propName.length) {
      throw new SyntaxError('Unexpected token ]')
    }
    ret.push(unquote(propName))
  }

  const rest = varName.substring(closeBracketIndex)
  pushString(rest, ret)

  return ret
}

// TODO: refactor so we can call toPath.cached(varName) instead
export class CachedToPath {
  private toPathCache: {
    [path: string]: PropNames
  }

  private cachedPaths: string[]
  private cachedPathsIndex: number

  constructor(private size: number) {
    this.clear()
  }

  public clear() {
    this.cachedPathsIndex = 0
    this.toPathCache = {}
    this.cachedPaths = new Array(this.size)
  }

  /**
   * This is just a faster version of toPath()
   * @param varName - the path string
   */
  public toPath(varName: string): PropNames {
    let result = this.toPathCache[varName]
    if (!result) {
      result = this.toPathCache[varName] = toPath(varName)
      const keyToDelete = this.cachedPaths[this.cachedPathsIndex]
      if (keyToDelete !== undefined) {
        delete this.toPathCache[keyToDelete]
      }
      this.cachedPaths[this.cachedPathsIndex] = varName
      this.cachedPathsIndex++
      this.cachedPathsIndex %= this.size
    }
    return result
  }
}

export const cached = new CachedToPath(cacheSize)

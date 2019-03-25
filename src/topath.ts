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

export class Cache<T> {
  private map: {
    [varName: string]: T
  }

  private cachedKeys: string[]
  private oldestIndex: number

  constructor(private size: number) {
    this.reset()
  }

  public reset() {
    this.oldestIndex = 0
    this.map = {}
    this.cachedKeys = new Array(this.size)
  }

  public get(key: string): T {
    return this.map[key]
  }

  public set(key: string, value: T) {
    this.map[key] = value
    const oldestKey = this.cachedKeys[this.oldestIndex]
    if (oldestKey !== undefined) {
      delete this.map[oldestKey]
    }
    this.cachedKeys[this.oldestIndex] = key
    this.oldestIndex++
    this.oldestIndex %= this.size
  }
}

export const cache = new Cache<PropNames>(cacheSize)

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
function propBetweenBrackets(propName: string): string {
  propName.trim()
  // in our algorithms key is always a string and never only a string of spaces
  const firstChar = propName.charAt(0)
  const lastChar = propName.substr(-1)
  if (quoteChars.includes(firstChar) || quoteChars.includes(lastChar)) {
    if (propName.length < 2) {
      throw new SyntaxError(
        'Invalid or unexpected token. Unterminated string quotation.' + propName
      )
    }
    if (firstChar !== lastChar) {
      throw new SyntaxError('Mismatching string quotation ' + propName)
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
  if (propName.endsWith('.')) {
    throw new SyntaxError('Unexpected token . at the end of' + propName)
  }
  if (propName !== '') {
    const propNameParts = propName.split('.')
    for (const propNamePart of propNameParts) {
      const trimmedPropName = propNamePart.trim()
      if (trimmedPropName === '') {
        throw new SyntaxError(
          'Unexpected token . Encountered empty prop name when parsing ' +
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
      throw new SyntaxError(
        'Unexpected end of input. Missing ] in varName ' + varName
      )
    }

    propName = varName.substring(openBracketIndex + 1, closeBracketIndex).trim()

    if (propName.length === 0) {
      throw new SyntaxError('Unexpected token ]')
    }

    if (propName.includes('[')) {
      throw new SyntaxError('Missing ] in varName ' + varName)
    }

    closeBracketIndex++
    beforeBracket = varName.substring(currentIndex, openBracketIndex)
    pushPropName(propNames, beforeBracket)

    propNames.push(propBetweenBrackets(propName))
  }

  const rest = varName.substring(closeBracketIndex)
  pushPropName(propNames, rest)

  return propNames
}

/**
 * This is just a faster version of `toPath()`
 */
function toPathCached(varName: string): PropNames {
  let result = cache.get(varName)
  if (result === undefined) {
    result = toPath(varName)
    cache.set(varName, result)
  }
  return result
}

toPath.cached = toPathCached

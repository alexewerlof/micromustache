import { isStr } from './utils'

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

/**
 * @ignore
 */
export class Cache<T> {
  private map: {
    [varName: string]: T
  }

  private cachedKeys: string[]
  private oldestIndex: number

  constructor(private size: number) {
    this.reset()
  }

  public reset(): void {
    this.oldestIndex = 0
    this.map = {}
    this.cachedKeys = new Array(this.size)
  }

  public get(key: string): T {
    return this.map[key]
  }

  public set(key: string, value: T): void {
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

const cache = new Cache<PropNames>(cacheSize)

/**
 * Removes the quotes from a string and returns it.
 * @param propName an string with quotations
 * @throws `SyntaxError` if the quotation symbols don't match or one is missing
 * @returns the input with its quotes removed
 */
function propBetweenBrackets(propName: string): string {
  // in our algorithms key is always a string and never only a string of spaces
  const firstChar = propName.charAt(0)
  const lastChar = propName.substr(-1)
  if (quoteChars.includes(firstChar) || quoteChars.includes(lastChar)) {
    if (propName.length < 2 || firstChar !== lastChar) {
      throw new SyntaxError('Mismatching string quotation: ' + propName)
    }
    return propName.substring(1, propName.length - 1)
  }

  if (propName.includes('[')) {
    throw new SyntaxError('Missing ] in varName ' + propName)
  }

  // Normalize leading plus from numerical indices
  if (firstChar === '+') {
    return propName.substr(1)
  }

  return propName
}

function pushPropName(propNames: string[], propName: string, preDot: boolean): string[] {
  let pName = propName.trim()
  if (pName === '') {
    return propNames
  }

  if (pName.startsWith('.')) {
    if (preDot) {
      pName = pName.substr(1).trim()
      if (pName === '') {
        return propNames
      }
    } else {
      throw new SyntaxError('Unexpected . at the start of "' + propName + '"')
    }
  } else if (preDot) {
    throw new SyntaxError('Missing . at the start of "' + propName + '"')
  }

  if (pName.endsWith('.')) {
    throw new SyntaxError('Unexpected "." at the end of "' + propName + '"')
  }

  const propNameParts = pName.split('.')
  for (const propNamePart of propNameParts) {
    const trimmedPropName = propNamePart.trim()
    if (trimmedPropName === '') {
      throw new SyntaxError('Empty prop name when parsing "' + propName + '"')
    }
    propNames.push(trimmedPropName)
  }

  return propNames
}

/**
 * Breaks a variable name to an array of strings that can be used to get a
 * particular value from an object
 * @param varName - the variable name as it occurs in the template.
 * For example `a["b"].c`
 * @throws `TypeError` if the varName is not a string
 * @throws `SyntaxError` if the varName syntax has a problem
 * @returns - an array of property names that can be used to get a particular
 * value.
 * For example `['a', 'b', 'c']`
 */
export function toPath(varName: string): PropNames {
  if (!isStr(varName)) {
    throw new TypeError('Expected string but Got ' + varName)
  }

  let openBracketIndex: number
  let closeBracketIndex = 0
  let beforeBracket: string
  let propName: string
  let preDot = false
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

    if (propName.length === 0) {
      throw new SyntaxError('Unexpected token ]')
    }

    closeBracketIndex++
    beforeBracket = varName.substring(currentIndex, openBracketIndex)
    pushPropName(propNames, beforeBracket, preDot)

    propNames.push(propBetweenBrackets(propName))
    preDot = true
  }

  const rest = varName.substring(closeBracketIndex)
  return pushPropName(propNames, rest, preDot)
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

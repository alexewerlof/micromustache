export type Paths = string[]

const quoteChars = '\'"`'

function isQuote(str: string): boolean {
  return quoteChars.indexOf(str) !== -1
}

/**
 * Trim and remove the starting dot if it exists
 * @param rawPath - the raw path like ".a" or " . a"
 * @return - the input trimmed and without a leading dot
 */
function normalizePath(rawPath: string) {
  const path = rawPath.trim()
  if (path.startsWith('.')) {
    return path.substr(1)
  }
  return path
}

export function unquote(value: string): string {
  const key = value.trim()
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
  str = normalizePath(str)
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
 *
 * @param path TODO move it to its own file
 */
export function toPath(path: string): Paths {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string but. Got ' + path)
  }

  path = normalizePath(path)
  if (path === '') {
    return []
  }

  let openBracketIndex: number
  let closeBracketIndex: number = 0
  let beforeBracket: string
  let varName: string

  const ret: Paths = []

  for (
    let currentIndex = 0;
    currentIndex < path.length;
    currentIndex = closeBracketIndex
  ) {
    openBracketIndex = path.indexOf('[', currentIndex)
    if (openBracketIndex === -1) {
      break
    }

    closeBracketIndex = path.indexOf(']', openBracketIndex)
    if (closeBracketIndex === -1) {
      throw new SyntaxError('Missing ] in path ' + path)
    }

    varName = path.substring(openBracketIndex + 1, closeBracketIndex).trim()

    if (varName.includes('[')) {
      throw new SyntaxError('Missing ] in path ' + path)
    }

    closeBracketIndex++
    beforeBracket = path.substring(currentIndex, openBracketIndex)
    pushString(beforeBracket, ret)

    if (!varName.length) {
      throw new SyntaxError('Unexpected token ]')
    }
    ret.push(unquote(varName))
  }

  const rest = path.substring(closeBracketIndex)
  pushString(rest, ret)

  return ret
}

export class CachedToPath {
  private toPathCache: {
    [path: string]: Paths
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
   * @param path - the path string
   */
  public toPath(path: string): Paths {
    let result = this.toPathCache[path]
    if (!result) {
      result = this.toPathCache[path] = toPath(path)
      const keyToDelete = this.cachedPaths[this.cachedPathsIndex]
      if (keyToDelete !== undefined) {
        delete this.toPathCache[keyToDelete]
      }
      this.cachedPaths[this.cachedPathsIndex] = path
      this.cachedPathsIndex++
      this.cachedPathsIndex %= this.size
    }
    return result
  }
}

export const cached = new CachedToPath(100)

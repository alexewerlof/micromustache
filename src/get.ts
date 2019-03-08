import {
  isValidScope,
  assertReference,
  isString,
  assertSyntax,
  assertType
} from './util'
import { IParseOptions, tokenize } from './tokenize'

const tokenizeOptions: IParseOptions = {
  openSymbol: '[',
  closeSymbol: ']'
}

function isQuote(str: string): boolean {
  return str === "'" || str === '"' || str === '`'
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
    assertSyntax(
      key.length >= 2 && firstChar === lastChar,
      'Invalid or unexpected token',
      key
    )
    return key.substring(1, key.length - 1)
  }

  // Normalize leading plus from numerical indices
  if (key.charAt(0) === '+') {
    return key.substr(1)
  }

  return key
}

const toPathCache: {
  [path: string]: string[]
} = {}

const cachedPaths = new Array(100)
let cachedPathsPointer = 0

export function toPathMemoized(path: string): string[] {
  let result = toPathCache[path]
  if (!result) {
    result = toPathCache[path] = toPath(path)
    // console.log('caching', path, result)
    // console.log('cachedPathsPointer', cachedPathsPointer)
    const pathToDelete = cachedPaths[cachedPathsPointer]
    if (pathToDelete !== undefined) {
      // console.log('deleting', pathToDelete)
      delete toPathCache[pathToDelete]
    }
    cachedPaths[cachedPathsPointer] = path
    // console.log('cachedPaths', cachedPaths)
    cachedPathsPointer++
    cachedPathsPointer %= cachedPaths.length
  }
  return result
}

export function toPath(path: string): string[] {
  assertType(
    isString(path),
    'Path must be a string but it is',
    typeof path,
    path
  )

  path = normalizePath(path)
  if (path === '') {
    return []
  }

  // a["b"] . c => { strings: ['a', ' . c'], varNames: ['"b"'] }
  const { strings, varNames } = tokenize(path, tokenizeOptions)

  const ret: string[] = []

  let i = 0
  while (i < strings.length) {
    const str = normalizePath(strings[i])
    if (str !== '') {
      const splitPath = str.split('.')
      for (const p of splitPath) {
        const sTrimmed = p.trim()
        assertSyntax(
          sTrimmed !== '',
          'Unexpected token. Encountered empty path when parsing',
          str
        )
        ret.push(sTrimmed)
      }
    }

    if (i < varNames.length) {
      ret.push(unquote(varNames[i]))
    }
    i++
  }
  return ret
}

// tslint:disable-next-line ban-types
export type Scope = {} | Function

/**
 * Similar to lodash _.get()
 *
 * Differences with JavaScript:
 * No support for keys that include `[` or `]`.
 * No support for keys that include `'` or `"` or `.
 * `foo[bar]` is allowed while JavaScript treats `bar` as a variable and tries to lookup
 * its value or throws a `ReferenceError` if there is no variable called `bar`.
 * @throws TypeError if the object variable is not an object
 * @param scope - the view object
 * @param path - the variable path to lookup
 * @returns - the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export function get(scope: Scope, path: string): any {
  assertType(
    isValidScope(scope),
    'The scope should be an object or function but is',
    typeof scope,
    scope
  )
  const pathArr = toPath(path)
  return getKeys(scope, pathArr)
}

/**
 * Same as get() but expects an array of keys instead of path
 * @throws TypeError if the scope variable is not an object or the keys don't exist
 * @param scope - an object to resolve value from
 * @param pathArr - an array of keys that specify the path to the lookup
 * @returns - the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export function getKeys(scope: Scope, pathArr: string[]): any {
  let currentScope = scope
  for (const key of pathArr) {
    assertReference(
      isValidScope(currentScope),
      key,
      'is not defined. Parsed path:',
      pathArr
    )
    // @ts-ignore
    currentScope = currentScope[key]
  }
  return currentScope
}

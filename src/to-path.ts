import { isString, assertTruthy } from './util'
import { parseString } from './tokenize'
import { ITokenizeOptions } from './types'

const parseStringOptions: ITokenizeOptions = {
  openSymbol: '[',
  closeSymbol: ']'
}

function isQuote(str: string): boolean {
  return /['"`]/.test(str)
}

/**
 * @param rawPath the raw path like ".a" or " . a"
 */
function normalizePath(rawPath: string) {
  let path = rawPath.trim()
  if (path.startsWith('.')) {
    path = path.substr(1)
  }
  return path
}

function pushToRet(str: string, ret: string[]): void {
  str = normalizePath(str)
  if (str === '') {
    return
  }
  str.split('.').forEach(s => {
    const sTrimmed = s.trim()
    assertTruthy(
      sTrimmed !== '',
      `Unexpected token. Encountered empty path when parsing ${str}`,
      SyntaxError
    )
    ret.push(sTrimmed)
  })
}

export function unquote(value: string): string {
  const key = value.trim()
  // in our algorithms key is always a string and never only a string of spaces
  const firstChar = key.charAt(0)
  const lastChar = key.substr(-1)
  if (isQuote(firstChar) || isQuote(lastChar)) {
    assertTruthy(
      key.length >= 2 && firstChar === lastChar,
      `Invalid or unexpected token ${key}`,
      SyntaxError
    )
    return key.substring(1, key.length - 1)
  }

  // Normalize leading plus from numerical indices
  if (key.charAt(0) === '+') {
    return key.substr(1)
  }

  return key
}

export function toPath(path: string): string[] {
  assertTruthy(
    isString(path),
    `Path must be a string but it is ${typeof path}: ${path}`,
    TypeError
  )

  path = normalizePath(path)
  if (path === '') {
    return []
  }

  // a["b"] . c => { strings: ['a', ' . c'], values: ['"b"'] }
  const { strings, values } = parseString(path, parseStringOptions)

  const ret: string[] = []

  let i = 0
  while (i < strings.length) {
    pushToRet(strings[i], ret)
    if (i < values.length) {
      ret.push(unquote(values[i]))
    }
    i++
  }
  return ret
}

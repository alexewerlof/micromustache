import { isString, assertSyntax, assertType } from './util'
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
  let path = rawPath.trim()
  if (path.startsWith('.')) {
    path = path.substr(1)
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

  // a["b"] . c => { strings: ['a', ' . c'], values: ['"b"'] }
  const { strings, values } = tokenize(path, tokenizeOptions)

  const ret: string[] = []

  let i = 0
  while (i < strings.length) {
    const str = normalizePath(strings[i])
    if (str !== '') {
      str.split('.').forEach(s => {
        const sTrimmed = s.trim()
        assertSyntax(
          sTrimmed !== '',
          'Unexpected token. Encountered empty path when parsing',
          str
        )
        ret.push(sTrimmed)
      })
    }

    if (i < values.length) {
      ret.push(unquote(values[i]))
    }
    i++
  }
  return ret
}

import { Scope } from './get'

export function isObject(val: any): val is {} {
  return val && typeof val === 'object'
}

export function isValidScope(val: any): val is Scope {
  if (!val) {
    return false
  }
  const type = typeof val
  return type === 'object' || type === 'function'
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}

// tslint:disable-next-line:ban-types
export function isFunction(val: any): val is Function {
  return typeof val === 'function'
}

export function isDefined(val: any) {
  return val !== undefined
}

export function assertTruthy(
  expression: any,
  message: string,
  errorConstructor:
    | ErrorConstructor
    | TypeErrorConstructor
    | SyntaxErrorConstructor = Error
) {
  if (!expression) {
    if (errorConstructor) {
      throw new errorConstructor(message)
    }
  }
}

/**
 * Reference: https://en.wikipedia.org/wiki/String_interpolation
 * No support for Rust, Scala, Java, Bash, Perl, TCL string interpolation syntax
 */
const OPEN_CLOSE_SYMBOLS: {
  [openSymbol: string]: string
} = {
  '{{': '}}', // Mustache, Handlebars
  '#{': '}', // Ruby, Crystal, CoffeeScript
  '${': '}', // Bash, ES6, TypeScript, Dart, Groovy, Haxe, Kotlin, PHP
  '$(': ')', // Boo, Nemerle
  '%(': ')', // Python
  '(': ')', // Swift
  '{': '}', // C#, Sciter, React JSX
  '<?=': '?>', // PHP
  '<%=': '%>', // Lodash.template()
  '<': '>' // HTML, XML
}

export function guessCloseSymbol(openSymbol: string) {
  assertTruthy(
    openSymbol in OPEN_CLOSE_SYMBOLS,
    `Cannot guess a close symbol for ${openSymbol}`
  )
  return OPEN_CLOSE_SYMBOLS[openSymbol]
}

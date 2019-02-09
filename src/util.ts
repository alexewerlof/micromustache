export function isObject(val: any) {
  return val && typeof val === 'object'
}

export function isValidScope(val: any) {
  if (!val) {
    return false
  }
  const type = typeof val
  return type === 'object' || type === 'function'
}

export function isString(val: any) {
  return typeof val === 'string'
}

export function isFunction(val: any) {
  return typeof val === 'function'
}

export function isDefined(val: any) {
  return val !== undefined
}

// TODO let it build the string lazily instead of expecting a string template for the message
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
  '<': '>', // HTML, XML
  '<%=': '%>' // Lodash.template()
  // No support for Rust, Scala, Java, Bash, Perl, TCL
}

export function guessCloseSymbol(openSymbol: string) {
  assertTruthy(
    openSymbol in OPEN_CLOSE_SYMBOLS,
    `Cannot guess a close symbol for ${openSymbol}`
  )
  return OPEN_CLOSE_SYMBOLS[openSymbol]
}

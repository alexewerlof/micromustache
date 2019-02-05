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

export function asyncMap<T>(arr: T[], iteratee: (item: T) => Promise<any>) {
  return Promise.all(arr.map(iteratee))
}

/**
 * Reference: https://en.wikipedia.org/wiki/String_interpolation
 */
const OPEN_CLOSE_SYMBOLS: {
  [openSymbol: string]: string | RegExp
} = {
  '{{': '}}', // Mustache, Handlebars
  '#{': '}', // Ruby, Crystal, CoffeeScript
  '${': '}', // Bash, ES6, TypeScript, Dart, Groovy, Haxe, Kotlin, PHP
  '$(': ')', // Boo, Nemerle
  '%(': ')', // Python
  '(': ')', // Swift
  '{': '}', // C#, Sciter
  '<?=': '?>', // PHP
  '<': '>', // HTML, XML
  '<%=': '%>', // Lodash.template()
  // TODO: use empty string as a marker instead
  $: /\b/ // Bash, Perl, TCL
  // No support for Rust, Scala, Java
}

export function guessCloseSymbol(openSymbol: string) {
  assertTruthy(
    openSymbol in OPEN_CLOSE_SYMBOLS,
    `Cannot guess a close symbol for ${openSymbol}`
  )
  return OPEN_CLOSE_SYMBOLS[openSymbol]
}

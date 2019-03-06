import {
  assertTruthy,
  isString,
  isObject,
  assertSyntax,
  assertType
} from './util'

export interface ITokens {
  strings: string[]
  varNames: string[]
}

export interface IParseOptions {
  /**
   * The string that indicates opening a variable interpolation expression.
   * You just have to specify this one if your template symbols are one of the common ones.
   * For example if you specify {{ for openSymbol, the closeSymbol will be assumed }}
   */
  openSymbol?: string
  /** the string that indicates closing a variable interpolation expression */
  closeSymbol?: string
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
  '{': '}', // C#, Sciter, React JSX
  '$(': ')', // Boo, Nemerle
  '%(': ')', // Python
  '(': ')', // Swift
  '<?=': '?>', // PHP
  '<%=': '%>', // Lodash.template()
  '<': '>' // HTML, XML
}

export function guessCloseSymbol(openSymbol: string) {
  const closeSymbol = OPEN_CLOSE_SYMBOLS[openSymbol]
  assertTruthy(closeSymbol, 'Cannot guess a close symbol for', openSymbol)
  return closeSymbol
}

// TODO: support open and close symbols that are the same. Coldfusion requires it: https://en.wikipedia.org/wiki/String_interpolation
// TODO: Support escaping characters
// TODO: Support word boundary for closeSymbol
// TODO: Support nested markup like a[b.foo]
/**
 * Parse a string and returns an array of variable names and non-processing strings.
 * functions ready for the compiler to go through them.
 * This function could use regular expressions but using simpler searches is faster.
 *
 * @param template - the template
 * @param options - the options form compile()
 * @returns - the resulting string
 */
export function tokenize(
  template: string,
  options: IParseOptions = {}
): ITokens {
  assertType(isString(template), 'Template must be a string. Got', template)
  assertType(
    isObject(options),
    'When options is provided, it should be an object. Got',
    options
  )
  const { openSymbol = '{{' } = options
  const { closeSymbol = guessCloseSymbol(openSymbol) } = options

  // TODO: our algorithm doesn't really require that. Let's support %varname% too
  assertTruthy(
    openSymbol !== closeSymbol,
    `Open and close symbol can't be the same ${openSymbol}`
  )

  const openSymbolLength = openSymbol.length
  const closeSymbolLength = closeSymbol.length
  let openIndex: number
  let closeIndex: number = 0
  let before: string
  let varName: string
  const strings: string[] = []
  const varNames: string[] = []

  for (
    let currentIndex = 0;
    currentIndex < template.length;
    currentIndex = closeIndex
  ) {
    openIndex = template.indexOf(openSymbol, currentIndex)
    if (openIndex === -1) {
      break
    }

    closeIndex = template.indexOf(closeSymbol, openIndex)
    assertSyntax(
      closeIndex !== -1,
      'Missing',
      closeSymbol,
      'in template expression',
      template
    )

    varName = template
      .substring(openIndex + openSymbolLength, closeIndex)
      .trim()

    assertSyntax(
      !varName.includes(openSymbol),
      'Missing',
      closeSymbol,
      'in template expression',
      template
    )

    assertSyntax(varName.length, 'Unexpected token', closeSymbol)
    varNames.push(varName)

    closeIndex += closeSymbolLength
    before = template.substring(currentIndex, openIndex)
    strings.push(before)
  }

  const rest = template.substring(closeIndex)
  strings.push(rest)

  return { strings, varNames }
}

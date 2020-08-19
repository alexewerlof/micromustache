import { Scope, ResolveOptions, resolve } from './get'
import { compile, CompileOptions, CompiledTemplate } from './compile'
import { isObj, isStr } from './utils'
import { ParsedTemplate, isParsedTemplate } from './parse'

/**
 * The options for the [[stringify]] function
 */
export interface StringifyOptions {
  /**
   * When set to a truthy value, rendering literally puts a 'null' or
   * 'undefined' for values that are `null` or `undefined`.
   * By default it swallows those values to be compatible with Mustache.
   */
  readonly explicit?: boolean
}

/**
 * The options for the [[render]] function
 */
export interface RenderOptions extends CompileOptions, StringifyOptions, ResolveOptions {}

/**
 * The callback for resolving a value (synchronous)
 * @param scope the scope object that was passed to .render() function
 * @param path a string that appeared in the string between open and close tags
 * @example a template that is `Hi {{a.b.c}}!` leads to `'a.b.c'` as ref
 * @returns the value to be interpolated.
 */
export type ResolveFn = (path: string, scope?: Scope) => any

/**
 * Same as `ResolveFn` but for asynchronous functions
 */
export type ResolveFnAsync = (path: string, scope?: Scope) => Promise<any>

/**
 * Combines `subs` and `strings` to make a string
 */
export function stringify(
  parsedTemplate: ParsedTemplate<any>,
  options: StringifyOptions = {}
): string {
  if (!isParsedTemplate(parsedTemplate)) {
    throw new TypeError(`Invalid parsedTemplate: ${parsedTemplate}`)
  }

  if (!isObj(options)) {
    throw new TypeError(
      `stringify() expected an object option. Got a ${typeof options}: ${options}`
    )
  }

  const { explicit } = options
  const { strings, subs } = parsedTemplate
  const { length } = subs

  let ret = ''
  for (let i = 0; i < length; i++) {
    ret += strings[i]

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value: any = subs[i]

    if (explicit || (value !== null && value !== undefined)) {
      ret += value
    }
  }

  ret += strings[length]

  return ret
}

/**
 * Replaces every {{path}} inside the template with values from the scope
 * parameter.
 * @warning **When dealing with user input, always make sure to validate it.**
 * @param template The template containing one or more {{path}} as
 * placeholders for values from the `scope` parameter.
 * @param scope see the scope parameter to [[resolve]]
 * @param options same options as the [[compile]] function
 * @returns Template where its paths replaced with
 * corresponding values.
 * @throws any error that [[compile]] or [[refGet]]/[[pathGet]] or [[stringify]] may throw
 */
export function render(
  template: string | CompiledTemplate | ParsedTemplate<string>,
  scope: Scope,
  options?: RenderOptions
): string {
  const templateObj = isStr(template) ? compile(template, options) : template
  if (!isObj(templateObj)) {
    throw new TypeError(`render() expects a string or object template. Got ${template}`)
  }
  return stringify(resolve(templateObj, scope, options), options)
}

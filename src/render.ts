import { Scope, ResolveOptions, resolve } from './get'
import { compile, CompileOptions, CompiledTemplate } from './compile'
import { isObj, isStr, newTypeError } from './utils'
import { ParsedTemplate } from './parse'
import { StringifyOptions, stringify } from './stringify'

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
    throw newTypeError(render, 'a string or CompiledTemplate object', template)
  }
  return stringify(resolve(templateObj, scope, options), options)
}

import { Scope, refGet, pathGet, GetOptions } from './get'
import { compile, CompileOptions } from './compile'
import { isObj, isStr, isArr } from './utils'
import { ParsedTemplate, isParsedTemplate, parseTemplate } from './parse'
import { transform, transformAsync } from './transform'
import { Ref } from './tokenize'

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
 * The options for the [[resolve]] function
 */
export interface ResolveOptions extends StringifyOptions, GetOptions {}

/**
 * The options for the [[render]] function
 */
export interface RenderOptions extends CompileOptions, StringifyOptions, GetOptions {}

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
 * Puts the resolved `values` into the rest of the template (`strings`) and
 * returns the final result that'll be returned from `render()`, `renderFn()`
 * and `renderFnAsync()` functions.
 */
export function stringify(
  parsedTemplate: ParsedTemplate<any>,
  options: StringifyOptions = {}
): string {
  if (!isParsedTemplate(parsedTemplate)) {
    throw new TypeError(`Invalid parsedTemplate: ${parsedTemplate}`)
  }

  if (!isObj(options)) {
    throw new TypeError(`stringify() expected an object option. Got a ${typeof options}`)
  }

  const { explicit } = options
  const { strings, vars } = parsedTemplate
  const { length } = vars

  let ret = ''
  for (let i = 0; i < length; i++) {
    ret += strings[i]

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value: any = vars[i]

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
 * @param scope An object containing values for paths from the the
 * template. If it's omitted, we default to an empty object.
 * Since functions are objects in javascript, the `scope` can technically be a
 * function too but it won't be called. It'll be treated as an object and its
 * properties will be used for the lookup.
 * @param options same options as the [[compile]] function
 * @returns Template where its paths replaced with
 * corresponding values.
 * @throws any error that [[compile]] or [[refGet]] or [[stringify]] may throw
 */
export function render(
  template: string | ParsedTemplate<Ref | string>,
  scope: Scope,
  options?: RenderOptions
): string {
  const parsedTemplate = isStr(template) ? compile(template, options) : template
  const resolvedTemplate = isArr(parsedTemplate.vars[0])
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      transform(parsedTemplate, (ref: Ref) => refGet(ref, scope, options))
    : // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      transform(parsedTemplate, (path: string) => pathGet(path, scope, options))
  return stringify(resolvedTemplate, options)
}

export function renderFn(
  template: string | ParsedTemplate<string>,
  resolveFn: ResolveFn,
  scope: Scope,
  options?: RenderOptions
): string {
  const parsedTemplate = isStr(template) ? parseTemplate(template, options) : template

  return stringify(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    transform<string, any>(parsedTemplate, (path) => resolveFn(path, scope)),
    options
  )
}

export async function renderFnAsync(
  template: string,
  resolveFn: ResolveFnAsync,
  scope: Scope,
  options?: RenderOptions
): Promise<string> {
  const parsedTemplate = isStr(template) ? parseTemplate(template, options) : template

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return stringify(await transformAsync(parsedTemplate, (path) => resolveFn(path, scope)), options)
}

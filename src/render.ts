import { Scope, getRef, GetOptions } from './get'
import { compile, CompileOptions } from './compile'
import { isObj, isArr } from './utils'
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
 * Puts the resolved `values` into the rest of the template (`strings`) and
 * returns the final result that'll be returned from `render()`, `renderFn()`
 * and `renderFnAsync()` functions.
 */
export function stringify(
  strings: string[],
  values: any[],
  options: StringifyOptions = {}
): string {
  if (!isArr(strings) || !isArr(values)) {
    throw new TypeError(
      `Expected arrays for strings and values parameters. Got ${strings} and ${values}`
    )
  }
  if (strings.length - 1 !== values.length) {
    throw new RangeError(
      `The strings array (${strings.length}) should be one element longer than the values array (${values.length})`
    )
  }
  if (!isObj(options)) {
    throw new TypeError(`stringify() expected an object option. Got a ${typeof options}`)
  }
  const { explicit } = options
  const { length } = values

  let ret = ''
  for (let i = 0; i < length; i++) {
    ret += strings[i]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const value: any = values[i]

    if (explicit || (value !== null && value !== undefined)) {
      ret += value
    }
  }

  ret += strings[length]

  return ret
}

export function resolve<T = Ref | string>(
  strings: string[],
  fn: (scope: Scope, entity: T, options?: ResolveOptions) => any,
  scope: Scope,
  entities: T[],
  options?: ResolveOptions
): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const values: any[] = entities.map((entity) => fn(scope, entity, options))
  return stringify(strings, values, options)
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
 * @throws any error that [[compile]] or [[getRef]] or [[stringify]] may throw
 */
export function render(template: string, scope: Scope, options?: RenderOptions): string {
  const { strings, refs } = compile(template, options)
  return resolve(strings, getRef, scope, refs, options)
}

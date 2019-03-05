import { ITagInput, TagFn } from './tokenize'
import { Scope, getKeys, toPath } from './get'
import { isFunction, isObject, assertType } from './util'
import { ICompileOptions, compile } from './compile'

export interface IStringifyOptions {
  /** an optional string to be used when the value is an unsupported type */
  invalidType?: string
  /** an optional string to be used when JSON.stringify fails */
  invalidObj?: string
}

const OBJECT_TO_STRING = Object.prototype.toString

type ConvertibleToString = string | number | boolean

/**
 * The callback for resolving a value
 * @param view - the view object that was passed to .render() function
 * @param path - variable name before being parsed.
 * @example {a.b.c} ->  'a.b.c'
 * @example {  x  } -> 'x'
 * @returns the value to be interpolated.
 * If the function returns undefined, the value resolution algorithm will go ahead with the default
 * behaviour (resolving the variable name from the provided object).
 */
export type ResolveFn = (varName: string, scope?: Scope) => any | Promise<any>

export interface IRendererOptions extends IStringifyOptions {
  resolveFn?: ResolveFn
  resolveFnContext?: any
}

export class Renderer {
  private pathCache: {
    [path: string]: string[]
  } = {}

  private assembleCache: ConvertibleToString[]

  constructor(
    private tokens: ITagInput,
    private options: IRendererOptions = {}
  ) {
    assertType(
      isObject(options),
      'If options is passed, it should be an object. Got',
      options
    )
    const lastStringIndex = tokens.values.length
    this.assembleCache = new Array(lastStringIndex * 2 + 1)
    const { strings, values } = this.tokens
    for (let i = 0; i < strings.length; i++) {
      this.assembleCache[i * 2] = strings[i]
    }
    for (let i = 0; i < values.length; i++) {
      this.pathCache[i] = toPath(values[i])
    }
  }

  private assembleResults(
    values: any[],
    { invalidType = '', invalidObj = '{...}' }: IStringifyOptions = {}
  ): string {
    const { length } = values
    for (let i = 0; i < length; i++) {
      const value = values[i]
      const typeOfValue = typeof value
      const valueIndex = i * 2 + 1
      if (
        value === null ||
        value === undefined ||
        typeOfValue === 'string' ||
        typeOfValue === 'number' ||
        typeOfValue === 'boolean'
      ) {
        this.assembleCache[valueIndex] = value
      } else if (typeOfValue === 'object') {
        // At this point in the function we've already dealt with null values
        if (isFunction(value.toString) && value.toString !== OBJECT_TO_STRING) {
          this.assembleCache[valueIndex] = value.toString()
        } else {
          try {
            this.assembleCache[valueIndex] = JSON.stringify(value)
          } catch (jsonError) {
            this.assembleCache[valueIndex] = invalidObj
          }
        }
      } else {
        // Anything else will be replaced with an empty string
        // For example: undefined, Symbol, etc.
        this.assembleCache[valueIndex] = invalidType
      }
    }
    return this.assembleCache.join('')
  }

  private callResolver(
    scope: Scope = {},
    resolveFn: ResolveFn | undefined = this.options.resolveFn,
    resolveFnContext: any = this.options.resolveFnContext || scope
  ): any[] {
    const { values } = this.tokens
    const { length } = values
    const ret = new Array(length)
    let i = 0
    if (resolveFn === undefined) {
      while (i < length) {
        ret[i] = getKeys(scope, this.pathCache[i])
        i++
      }
    } else {
      assertType(
        isFunction(resolveFn),
        'Expected a resolver function but got',
        resolveFn
      )
      while (i < length) {
        ret[i] = resolveFn.call(resolveFnContext, values[i], scope)
        i++
      }
    }
    return ret
  }

  public render = (
    scope?: Scope,
    resolveFn?: ResolveFn,
    resolveFnContext?: any
  ): string => {
    const values = this.callResolver(scope, resolveFn, resolveFnContext)
    return this.assembleResults(values)
  }

  public renderAsync = async (
    scope?: Scope,
    resolveFn?: ResolveFn,
    resolveFnContext?: any
  ): Promise<string> => {
    const values = await Promise.all(
      this.callResolver(scope, resolveFn, resolveFnContext)
    )
    return this.assembleResults(values)
  }
}

/**
 * Replaces every {{variable}} inside the template with values provided by view.
 *
 * @param template - The template containing one or more {{variableNames}} every variable
 *        names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param scope - An object containing values for every variable names that is used in
 *        the template. If it's omitted and empty object will be assumed.
 * @param options - same as compiler options
 * @returns - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
export function render(
  template: string,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.render(scope)
}

/**
 * Same as render() but calls the resolver asynchronously
 */
export async function renderAsync(
  template: string,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.renderAsync(scope)
}

/**
 * Same as render but works on template literals (which are faster since JavaScript tokenizes them).
 * @param scope - Same as the scope for render()
 * @param options - Renderer options
 * @returns - A tag function that renders the string with the provided scope
 */
export function renderTag(
  scope?: Scope,
  options?: IRendererOptions
): TagFn<string> {
  return function tag(strings: string[], ...values: any): string {
    const renderer = new Renderer({ strings, values }, options)
    return renderer.render(scope)
  }
}

/**
 * Same as renderTag() but calls the resolver asynchronously
 */
export function renderTagAsync(
  scope?: Scope,
  options?: IRendererOptions
): TagFn<Promise<string>> {
  return async function tag(
    strings: string[],
    ...values: any
  ): Promise<string> {
    const renderer = new Renderer({ strings, values }, options)
    return renderer.renderAsync(scope)
  }
}

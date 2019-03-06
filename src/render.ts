import { Scope, getKeys, toPath } from './get'
import { isFunction, isObject, assertType, assertTruthy } from './util'
import { ICompileOptions, compile } from './compile'

export interface IStringifyOptions {
  /** an optional string to be used when the value is an unsupported type */
  invalidType?: string
  /** an optional string to be used when JSON.stringify fails */
  invalidObj?: string
}

const OBJECT_TO_STRING = Object.prototype.toString

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

function stringify(
  strings: string[],
  values: any[],
  { invalidType = '', invalidObj = '{...}' }: IStringifyOptions = {}
): string {
  let ret = ''
  const { length } = values
  for (let i = 0; i < length; i++) {
    ret += strings[i]
    const value = values[i]
    if (value === null || value === undefined || value === '') {
      continue
    }
    const typeOfValue = typeof value
    if (
      typeOfValue === 'string' ||
      typeOfValue === 'number' ||
      typeOfValue === 'boolean'
    ) {
      ret += value
    } else if (typeOfValue === 'object') {
      // At this point in the function we've already dealt with null values
      if (isFunction(value.toString) && value.toString !== OBJECT_TO_STRING) {
        ret += value.toString()
      } else {
        try {
          ret += JSON.stringify(value)
        } catch (jsonError) {
          ret += invalidObj
        }
      }
    } else {
      // Anything else will be replaced with an empty string
      // For example: undefined, Symbol, etc.
      ret += invalidType
    }
  }

  ret += strings[length]
  return ret
}

function resolveVarNames(
  scope: Scope = {},
  varNames: string[],
  resolveFn: ResolveFn
): any[] {
  assertType(
    isFunction(resolveFn),
    'Expected a resolver function but got',
    resolveFn
  )

  const { length } = varNames
  const values = new Array(length)
  for (let i = 0; i < length; i++) {
    values[i] = resolveFn(varNames[i], scope)
  }
  return values
}

export class Renderer {
  private toPathCache: {
    [path: string]: string[]
  } = {}

  constructor(
    private strings: string[],
    private values: string[],
    private options?: IStringifyOptions
  ) {
    assertType(Array.isArray(strings), 'the strings must be an array')
    assertType(Array.isArray(values), 'the values must be an array')
    assertTruthy(
      values.length === strings.length - 1,
      'the values array must have exactly one less element than the strings array'
    )
    if (options !== undefined) {
      assertType(
        isObject(options),
        'If options is passed, it should be an object. Got',
        options
      )
    }
    for (let i = 0; i < values.length; i++) {
      this.toPathCache[i] = toPath(values[i])
    }
  }

  public render = (scope: Scope = {}): string => {
    const { length } = this.values
    const resolvedValues = new Array(length)
    for (let i = 0; i < length; i++) {
      resolvedValues[i] = getKeys(scope, this.toPathCache[i])
    }
    return stringify(this.strings, resolvedValues, this.options)
  }

  public renderFn = (scope: Scope = {}, resolveFn: ResolveFn): string => {
    const values = resolveVarNames(scope, this.values, resolveFn)
    return stringify(this.strings, values, this.options)
  }

  public renderFnAsync = async (
    scope: Scope = {},
    resolveFn: ResolveFn
  ): Promise<string> => {
    const values = await Promise.all(
      resolveVarNames(scope, this.values, resolveFn)
    )
    return stringify(this.strings, values, this.options)
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
export function renderFn(
  template: string,
  resolveFn: ResolveFn,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.renderFn(scope, resolveFn)
}

/**
 * Same as render() but calls the resolver asynchronously
 */
export async function renderFnAsync(
  template: string,
  resolveFn: ResolveFn,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.renderFnAsync(scope, resolveFn)
}

import { Scope, getKeys, toPath, Paths } from './get'
import { isFunction, assertType, assertTruthy, Memoizer } from './util'
import { compile } from './compile'

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
export type ResolveFn = (varName: string, scope?: Scope) => any
export type ResolveFnAsync = (varName: string, scope?: Scope) => Promise<any>

function stringify(
  strings: string[],
  values: any[],
  renderNullAndUndefined: boolean
): string {
  let ret = ''
  const { length } = values
  for (let i = 0; i < length; i++) {
    ret += strings[i]
    const value = values[i]
    if (renderNullAndUndefined || (value !== null && value !== undefined)) {
      ret += value
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
  private static toPathMemoized = new Memoizer(toPath)
  private toPathCache: Paths[]

  constructor(
    private strings: string[],
    private varNames: string[],
    private renderNullAndUndefined = false
  ) {
    assertType(Array.isArray(strings), 'the strings must be an array')
    assertType(Array.isArray(varNames), 'the values must be an array')
    assertTruthy(
      varNames.length === strings.length - 1,
      'the values array must have exactly one less element than the strings array'
    )
    this.toPathCache = new Array(varNames.length)
    for (let i = 0; i < varNames.length; i++) {
      this.toPathCache[i] = Renderer.toPathMemoized.obtain(varNames[i])
    }
  }

  public render = (scope: Scope = {}): string => {
    const { length } = this.varNames
    const resolvedValues = new Array(length)
    for (let i = 0; i < length; i++) {
      resolvedValues[i] = getKeys(scope, this.toPathCache[i])
    }
    return stringify(this.strings, resolvedValues, this.renderNullAndUndefined)
  }

  public renderFn = (scope: Scope = {}, resolveFn: ResolveFn): string => {
    const values = resolveVarNames(scope, this.varNames, resolveFn)
    return stringify(this.strings, values, this.renderNullAndUndefined)
  }

  public renderFnAsync = async (
    scope: Scope = {},
    resolveFnAsync: ResolveFnAsync
  ): Promise<string> => {
    const values = await Promise.all(
      resolveVarNames(scope, this.varNames, resolveFnAsync)
    )
    return stringify(this.strings, values, this.renderNullAndUndefined)
  }
}

/**
 * Replaces every {{variable}} inside the template with values provided by view.
 *
 * @param template - The template containing one or more {{variableNames}} every variable
 *        names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param scope - An object containing values for every variable names that is used in
 *        the template. If it's omitted and empty object will be assumed.
 * @param renderNullAndUndefined - should we render null as 'null' and undefined as 'undefined'
 * @returns - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
export function render(
  template: string,
  scope?: Scope,
  renderNullAndUndefined?: boolean
) {
  const renderer: Renderer = compile(template, renderNullAndUndefined)
  return renderer.render(scope)
}

/**
 * Same as render() but calls the resolver asynchronously
 */
export function renderFn(
  template: string,
  resolveFn: ResolveFn,
  scope?: Scope,
  renderNullAndUndefined?: boolean
) {
  const renderer: Renderer = compile(template, renderNullAndUndefined)
  return renderer.renderFn(scope, resolveFn)
}

/**
 * Same as render() but calls the resolver asynchronously
 */
export async function renderFnAsync(
  template: string,
  resolveFnAsync: ResolveFnAsync,
  scope?: Scope,
  renderNullAndUndefined?: boolean
) {
  const renderer: Renderer = compile(template, renderNullAndUndefined)
  return renderer.renderFnAsync(scope, resolveFnAsync)
}

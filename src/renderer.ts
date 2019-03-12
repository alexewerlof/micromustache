import { Scope, getKeys, toPath, Paths } from './get'
import {
  isFunction,
  assertType,
  assertTruthy,
  CachedFn,
  isObject
} from './util'

export interface IRendererOptions {
  renderNullAndUndefined?: boolean
}

/**
 * The callback for resolving a value
 * @param scope - the scope object that was passed to .render() function
 * @param path - variable name before being parsed.
 * @example {a.b.c} ->  'a.b.c'
 * @example {  x  } -> 'x'
 * @returns the value to be interpolated.
 * If the function returns undefined, the value resolution algorithm will go ahead with the default
 * behaviour (resolving the variable name from the provided object).
 */
export type ResolveFn = (varName: string, scope?: Scope) => any
export type ResolveFnAsync = (varName: string, scope?: Scope) => Promise<any>

function resolveVarNames(
  resolveFn: ResolveFn,
  varNames: string[],
  scope: Scope = {}
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
  private static cachedToPath = new CachedFn(toPath)
  private toPathCache: Paths[]

  constructor(
    private strings: string[],
    private varNames: string[],
    private options: IRendererOptions = {}
  ) {
    assertType(
      Array.isArray(strings),
      'The strings must be an array. Got',
      strings
    )
    assertType(
      Array.isArray(varNames),
      'The varNames must be an array. Got',
      varNames
    )
    assertType(
      isObject(options),
      'The options param must be an object. Got',
      options
    )
    assertTruthy(
      varNames.length === strings.length - 1,
      'the values array must have exactly one less element than the strings array'
    )
    this.toPathCache = new Array(varNames.length)
    for (let i = 0; i < varNames.length; i++) {
      this.toPathCache[i] = Renderer.cachedToPath.obtain(varNames[i])
    }
  }

  private stringify(values: any[]): string {
    let ret = ''
    const { length } = values
    for (let i = 0; i < length; i++) {
      ret += this.strings[i]
      const value = values[i]
      if (
        this.options.renderNullAndUndefined ||
        (value !== null && value !== undefined)
      ) {
        ret += value
      }
    }

    ret += this.strings[length]
    return ret
  }

  public render = (scope: Scope = {}): string => {
    const { length } = this.varNames
    const values = new Array(length)
    for (let i = 0; i < length; i++) {
      values[i] = getKeys(scope, this.toPathCache[i])
    }
    return this.stringify(values)
  }

  public renderFn = (resolveFn: ResolveFn, scope: Scope = {}): string => {
    const values = resolveVarNames(resolveFn, this.varNames, scope)
    return this.stringify(values)
  }

  public renderFnAsync = async (
    resolveFnAsync: ResolveFnAsync,
    scope: Scope = {}
  ): Promise<string> => {
    const values = await Promise.all(
      resolveVarNames(resolveFnAsync, this.varNames, scope)
    )
    return this.stringify(values)
  }
}

import { Scope, getKeys, toPath, Paths } from './get'
import { isFunction, assertType, CachedFn, isObject } from './util'
import { ITokens } from './tokenize'

export interface IRendererOptions {
  renderNullAndUndefined?: boolean
  allowInvalidPaths?: boolean
  /** when set to a truthy value, validates the variable names */
  validatePaths?: boolean
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

export class Renderer {
  private static cachedToPath = new CachedFn(toPath)
  private toPathCache: Paths[]

  constructor(
    private tokens: ITokens,
    private readonly options: IRendererOptions = {}
  ) {
    assertType(
      isObject(tokens) &&
        Array.isArray(tokens.strings) &&
        Array.isArray(tokens.varNames) &&
        tokens.strings.length === tokens.varNames.length + 1,
      'Invalid tokens object',
      tokens
    )
    if (options.validatePaths) {
      // trying to initialize toPathCache parses them which is also validation
      this.cacheParsedPaths()
    }
  }

  private cacheParsedPaths() {
    const { varNames } = this.tokens
    if (this.toPathCache === undefined) {
      this.toPathCache = new Array(varNames.length)
      for (let i = 0; i < varNames.length; i++) {
        this.toPathCache[i] = Renderer.cachedToPath.obtain(varNames[i])
      }
    }
  }

  private stringify(values: any[]): string {
    const { strings } = this.tokens
    let ret = ''
    const { length } = values
    const { renderNullAndUndefined } = this.options
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

  public render = (scope: Scope = {}): string => {
    const { varNames } = this.tokens
    const { length } = varNames
    this.cacheParsedPaths()
    const values = new Array(length)
    for (let i = 0; i < length; i++) {
      values[i] = getKeys(
        scope,
        this.toPathCache[i],
        this.options.allowInvalidPaths
      )
    }
    return this.stringify(values)
  }

  private resolveVarNames(resolveFn: ResolveFn, scope: Scope = {}): any[] {
    assertType(
      isFunction(resolveFn),
      'Expected a resolver function but got',
      resolveFn
    )

    const { varNames } = this.tokens
    const { length } = varNames
    const values = new Array(length)
    for (let i = 0; i < length; i++) {
      values[i] = resolveFn(varNames[i], scope)
    }
    return values
  }

  public renderFn = (resolveFn: ResolveFn, scope: Scope = {}): string => {
    const values = this.resolveVarNames(resolveFn, scope)
    return this.stringify(values)
  }

  public renderFnAsync = (
    resolveFnAsync: ResolveFnAsync,
    scope: Scope = {}
  ): Promise<string> => {
    return Promise.all(this.resolveVarNames(resolveFnAsync, scope)).then(
      values => this.stringify(values)
    )
  }
}

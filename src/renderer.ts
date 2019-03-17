import { Scope, getKeys, toPath, Paths } from './get'
import { CachedFn } from './util'
import { ITokens } from './tokenize'

export interface IRendererOptions {
  /**
   * When set to a truthy value, rendering literally put a 'null' or
   * 'undefined' for values that are `null` or `undefined`.
   * By default we swallow them and use an empty string to be compatible with
   * Mustache/Handlebars.
   */
  renderNullAndUndefined?: boolean
  /**
   * When set to a truthy value, we allow invalid paths instead of throwing an
   * error
   */
  allowInvalidPaths?: boolean
  /** when set to a truthy value, validates the variable names */
  validatePaths?: boolean
}

/**
 * The callback for resolving a value (synchronous)
 * @param scope - the scope object that was passed to .render() function
 * @param path - variable name before being parsed.
 * @example - a var name that is {{a.b.c}} gives  'a.b.c'
 * @returns - the value to be interpolated.
 */
export type ResolveFn = (varName: string, scope?: Scope) => any

/**
 * Same as `ResolveFn` but for asynchronous functions
 */
export type ResolveFnAsync = (varName: string, scope?: Scope) => Promise<any>

/**
 * This class does the heavy lifting of interpolation (putting the actual values
 * in the template).
 * This is created by the `.compile()` method and is used under the hood by
 * `.render()`, `renderFn()` and `renderFnAsync()` functions.
 */
export class Renderer {
  /**
   * A static cache with a limited size that holds the last calls to the
   * `toPath()` function
   */
  private static cachedToPath = new CachedFn(toPath)
  /**
   * Another cache that holds the parsed values for `toPath()` one per varName
   */
  private toPathCache: Paths[]

  /**
   * Creates a new Renderer instance. This is called internally by the compiler.
   * @param tokens - the result of the `.tokenize()` function
   * @param options - some options for customizing the rendering process
   */
  constructor(
    private tokens: ITokens,
    private readonly options: IRendererOptions = {}
  ) {
    if (
      typeof tokens !== 'object' ||
      !Array.isArray(tokens.strings) ||
      !Array.isArray(tokens.varNames) ||
      tokens.strings.length !== tokens.varNames.length + 1
    ) {
      throw new TypeError('Invalid tokens object ' + tokens)
    }
    if (options.validatePaths) {
      // trying to initialize toPathCache parses them which is also validation
      this.cacheParsedPaths()
    }
  }

  /**
   * This function is called internally for filling in the `toPathCache` cache.
   * If the `validatePaths` option for the constructor is set to a truthy value,
   * this function is called immediately which leads to a validation as well
   * because it throws an error if it cannot parse variable names.
   */
  private cacheParsedPaths() {
    const { varNames } = this.tokens
    if (this.toPathCache === undefined) {
      this.toPathCache = new Array(varNames.length)
      for (let i = 0; i < varNames.length; i++) {
        this.toPathCache[i] = Renderer.cachedToPath.obtain(varNames[i])
      }
    }
  }

  /**
   * Puts the resolved `values` into the rest of the template (`strings`) and
   * returns the final result that'll be returned from `render()`, `renderFn()`
   * and `renderFnAsync()` functions.
   */
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
    if (typeof resolveFn !== 'function') {
      throw new TypeError('Expected a resolver function but got ' + resolveFn)
    }

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

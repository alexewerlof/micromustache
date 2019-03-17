import { Scope, Paths, cached, get } from './get'
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
  validateVarNames?: boolean
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
    if (options.validateVarNames) {
      // trying to initialize toPathCache parses them which is also validation
      this.cacheParsedPaths()
    }
  }

  /**
   * This function is called internally for filling in the `toPathCache` cache.
   * If the `validateVarNames` option for the constructor is set to a truthy value,
   * this function is called immediately which leads to a validation as well
   * because it throws an error if it cannot parse variable names.
   */
  private cacheParsedPaths() {
    const { varNames } = this.tokens
    if (this.toPathCache === undefined) {
      this.toPathCache = new Array(varNames.length)
      for (let i = 0; i < varNames.length; i++) {
        this.toPathCache[i] = cached.toPath(varNames[i])
      }
    }
  }

  public render = (scope: Scope = {}): string => {
    const { varNames } = this.tokens
    const { length } = varNames
    this.cacheParsedPaths()
    const values = new Array(length)
    for (let i = 0; i < length; i++) {
      values[i] = get(
        scope,
        this.toPathCache[i],
        this.options.allowInvalidPaths
      )
    }
    return stringify(
      this.tokens.strings,
      values,
      this.options.renderNullAndUndefined
    )
  }

  public renderFn = (resolveFn: ResolveFn, scope: Scope = {}): string => {
    const values = resolveVarNames(resolveFn, this.tokens.varNames, scope)
    return stringify(
      this.tokens.strings,
      values,
      this.options.renderNullAndUndefined
    )
  }

  public renderFnAsync = (
    resolveFnAsync: ResolveFnAsync,
    scope: Scope = {}
  ): Promise<string> => {
    return Promise.all(
      resolveVarNames(resolveFnAsync, this.tokens.varNames, scope)
    ).then(values =>
      stringify(
        this.tokens.strings,
        values,
        this.options.renderNullAndUndefined
      )
    )
  }
}

function resolveVarNames(
  resolveFn: ResolveFn,
  varNames: string[],
  scope: Scope = {}
): any[] {
  if (typeof resolveFn !== 'function') {
    throw new TypeError('Expected a resolver function but got ' + resolveFn)
  }

  const { length } = varNames
  const values = new Array(length)
  for (let i = 0; i < length; i++) {
    values[i] = resolveFn(varNames[i], scope)
  }
  return values
}

/**
 * Puts the resolved `values` into the rest of the template (`strings`) and
 * returns the final result that'll be returned from `render()`, `renderFn()`
 * and `renderFnAsync()` functions.
 */
function stringify(
  strings: string[],
  values: any[],
  renderNullAndUndefined?: boolean
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

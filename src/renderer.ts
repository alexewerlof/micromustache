import { isFn, isObj, isArr } from './utils'
import { Scope, get, IGetOptions } from './get'
import { toPath } from './topath'
import { ITokens } from './tokenize'

/**
 * The options passed to Renderer's constructor
 */
export interface IRendererOptions extends IGetOptions {
  /**
   * When set to a truthy value, rendering literally puts a 'null' or
   * 'undefined' for values that are `null` or `undefined`.
   * By default it swallows those values to be compatible with Mustache.
   */
  readonly explicit?: boolean
  /** when set to a truthy value, validates the variable names */
  readonly validateVarNames?: boolean
}

/**
 * The callback for resolving a value (synchronous)
 * @param scope the scope object that was passed to .render() function
 * @param path variable name before being parsed.
 * @example a template that is `Hi {{a.b.c}}!` leads to `'a.b.c'` as path
 * @returns the value to be interpolated.
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
  private toPathCache: string[][]

  /**
   * Creates a new Renderer instance. This is called internally by the compiler.
   * @param tokens - the result of the `.tokenize()` function
   * @param options - some options for customizing the rendering process
   * @throws `TypeError` if the token is invalid
   */
  constructor(private readonly tokens: ITokens, private readonly options: IRendererOptions = {}) {
    if (
      !isObj(tokens) ||
      !isArr(tokens.strings) ||
      !isArr(tokens.varNames) ||
      tokens.strings.length !== tokens.varNames.length + 1
    ) {
      // This is most likely an internal error from tokenization algorithm
      throw new TypeError(`Invalid tokens object`)
    }

    if (!isObj(options)) {
      throw new TypeError(`Options should be an object. Got a ${typeof options}`)
    }

    if (options.validateVarNames) {
      // trying to initialize toPathCache parses them which is also validation
      this.cacheParsedPaths()
    }
  }

  /**
   * This function is called internally for filling in the `toPathCache` cache.
   * If the `validateVarNames` option for the constructor is set to a truthy
   * value, this function is called immediately which leads to a validation as
   * well because it throws an error if it cannot parse variable names.
   */
  private cacheParsedPaths(): void {
    const { varNames } = this.tokens
    if (this.toPathCache === undefined) {
      this.toPathCache = new Array<string[]>(varNames.length)

      for (let i = 0; i < varNames.length; i++) {
        this.toPathCache[i] = toPath.cached(varNames[i])
      }
    }
  }

  /**
   * Replaces every {{varName}} inside the template with values from the scope
   * parameter.
   *
   * @param template The template containing one or more {{varName}} as
   * placeholders for values from the `scope` parameter.
   * @param scope An object containing values for variable names from the the
   * template. If it's omitted, we default to an empty object.
   */
  public render = (scope: Scope = {}): string => {
    const { varNames } = this.tokens
    const { length } = varNames

    this.cacheParsedPaths()

    const values = new Array<any>(length)

    for (let i = 0; i < length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      values[i] = get(scope, this.toPathCache[i], this.options)
    }

    return this.stringify(values)
  }

  /**
   * Same as [[render]] but accepts a resolver function which will be
   * responsible for returning a value for every varName.
   */
  public renderFn = (resolveFn: ResolveFn, scope: Scope = {}): string => {
    const values = this.resolveVarNames(resolveFn, scope)
    return this.stringify(values)
  }

  /**
   * Same as [[render]] but accepts a resolver function which will be responsible
   * for returning promise that resolves to a value for every varName.
   */
  public renderFnAsync = (resolveFnAsync: ResolveFnAsync, scope: Scope = {}): Promise<string> => {
    return Promise.all(this.resolveVarNames(resolveFnAsync, scope)).then((values) =>
      this.stringify(values)
    )
  }

  private resolveVarNames(resolveFn: ResolveFn, scope: Scope = {}): any[] {
    const { varNames } = this.tokens
    if (!isFn<ResolveFnAsync>(resolveFn)) {
      throw new TypeError(`Expected a resolver function. Got ${String(resolveFn)}`)
    }

    const { length } = varNames
    const values = new Array<any>(length)
    for (let i = 0; i < length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      values[i] = resolveFn.call(null, varNames[i], scope)
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return values
  }

  /**
   * Puts the resolved `values` into the rest of the template (`strings`) and
   * returns the final result that'll be returned from `render()`, `renderFn()`
   * and `renderFnAsync()` functions.
   */
  private stringify(values: any[]): string {
    const { strings } = this.tokens
    const { explicit } = this.options
    const { length } = values

    let ret = ''
    for (let i = 0; i < length; i++) {
      ret += strings[i]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = values[i]

      if (explicit || (value !== null && value !== undefined)) {
        ret += value
      }
    }

    ret += strings[length]

    return ret
  }
}

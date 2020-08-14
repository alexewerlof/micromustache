import { isFn, isObj, isArr } from './utils'
import { Scope, get, GetOptions } from './get'
import { toPath } from './topath'
import { Tokens } from './tokenize'

/**
 * The options for the Renderer's constructor
 */
export interface RendererOptions extends GetOptions {
  /**
   * When set to a truthy value, rendering literally puts a 'null' or
   * 'undefined' for values that are `null` or `undefined`.
   * By default it swallows those values to be compatible with Mustache.
   */
  readonly explicit?: boolean
  /** when set to a truthy value, validates the refs */
  readonly validateRef?: boolean
}

/**
 * The callback for resolving a value (synchronous)
 * @param scope the scope object that was passed to .render() function
 * @param ref a string that appeared in the string between open and close tags
 * @example a template that is `Hi {{a.b.c}}!` leads to `'a.b.c'` as path
 * @returns the value to be interpolated.
 */
export type ResolveFn = (ref: string, scope?: Scope) => any

/**
 * Same as `ResolveFn` but for asynchronous functions
 */
export type ResolveFnAsync = (ref: string, scope?: Scope) => Promise<any>

/**
 * This class does the heavy lifting of interpolation (putting the actual values
 * in the template).
 * This is created by the `.compile()` method and is used under the hood by
 * `.render()`, `renderFn()` and `renderFnAsync()` functions.
 */
export class Renderer {
  /**
   * Another cache that holds the parsed values for `toPath()` one per ref
   */
  private toPathCache: string[][]

  /**
   * Creates a new Renderer instance. This is called internally by the compiler.
   * @param tokens - the result of the `.tokenize()` function
   * @param options - some options for customizing the rendering process
   * @throws `TypeError` if the token is invalid
   */
  constructor(private readonly tokens: Tokens, private readonly options: RendererOptions = {}) {
    if (
      !isObj(tokens) ||
      !isArr(tokens.strings) ||
      !isArr(tokens.refs) ||
      tokens.strings.length !== tokens.refs.length + 1
    ) {
      // This is most likely an internal error from tokenization algorithm
      throw new TypeError(`Invalid tokens object`)
    }

    if (!isObj(options)) {
      throw new TypeError(`Options should be an object. Got a ${typeof options}`)
    }

    if (options.validateRef) {
      // trying to initialize toPathCache parses them which is also validation
      this.cacheParsedPaths()
    }
  }

  /**
   * This function is called internally for filling in the `toPathCache` cache.
   * If the `validateRef` option for the constructor is set to a truthy
   * value, this function is called immediately which leads to a validation as
   * well because it throws an error if it cannot parse refs.
   */
  private cacheParsedPaths(): void {
    const { refs } = this.tokens
    if (this.toPathCache === undefined) {
      this.toPathCache = new Array<string[]>(refs.length)

      for (let i = 0; i < refs.length; i++) {
        this.toPathCache[i] = toPath.cached(refs[i])
      }
    }
  }

  /**
   * Replaces every {{ref}} inside the template with values from the scope
   * parameter.
   *
   * @param template The template containing one or more {{ref}} as
   * placeholders for values from the `scope` parameter.
   * @param scope An object containing values for refs from the the
   * template. If it's omitted, we default to an empty object.
   */
  public render = (scope: Scope = {}): string => {
    const { refs } = this.tokens
    const { length } = refs

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
   * responsible for returning a value for every ref.
   */
  public renderFn = (resolveFn: ResolveFn, scope: Scope = {}): string => {
    const values = this.resolveRefs(resolveFn, scope)
    return this.stringify(values)
  }

  /**
   * Same as [[render]] but accepts a resolver function which will be responsible
   * for returning promise that resolves to a value for every ref.
   */
  public renderFnAsync = (resolveFnAsync: ResolveFnAsync, scope: Scope = {}): Promise<string> => {
    return Promise.all(this.resolveRefs(resolveFnAsync, scope)).then((values) =>
      this.stringify(values)
    )
  }

  private resolveRefs(resolveFn: ResolveFn, scope: Scope = {}): any[] {
    const { refs } = this.tokens
    if (!isFn<ResolveFnAsync>(resolveFn)) {
      throw new TypeError(`Expected a resolver function. Got ${String(resolveFn)}`)
    }

    const { length } = refs
    const values = new Array<any>(length)
    for (let i = 0; i < length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      values[i] = resolveFn.call(null, refs[i], scope)
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

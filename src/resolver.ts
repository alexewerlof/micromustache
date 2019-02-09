import { ITagInput, NameToken } from './tokenize'
import { Scope, getKeys } from './get'
import { assertTruthy, isFunction } from './util'
import { IStringifyOptions, stringifyTagParams } from './stringify'

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
export type ResolveFn = (
  varName: string,
  scope?: Scope,
  nameToken?: NameToken
) => any | Promise<any>

export interface IResolverOptions extends IStringifyOptions {
  resolveFn?: ResolveFn
  resolveFnContext?: any
}

const defaultResolver: ResolveFn = (
  varName: string,
  scope: Scope,
  nameToken: NameToken
) => getKeys(scope, nameToken.paths)

export class Resolver {
  constructor(
    private tokens: ITagInput<NameToken>,
    private options: IResolverOptions
  ) {}

  private callResolver(
    scope: Scope,
    resolveFn: ResolveFn = this.options.resolveFn || defaultResolver
  ) {
    assertTruthy(
      isFunction(resolveFn),
      `Expected a resolver (async) function but got ${resolveFn}`,
      TypeError
    )
    return this.tokens.values.map(nameToken =>
      (resolveFn as ResolveFn).call(
        this.options.resolveFnContext,
        nameToken.varName,
        scope,
        nameToken
      )
    )
  }

  public render(scope: Scope = {}, resolveFn?: ResolveFn): string {
    const values = this.callResolver(scope, resolveFn)
    return stringifyTagParams(this.tokens.strings, values, this.options)
  }

  public async asyncRender(
    scope: Scope = {},
    resolveFn?: ResolveFn
  ): Promise<string> {
    const values = await Promise.all(this.callResolver(scope, resolveFn))
    return stringifyTagParams(this.tokens.strings, values, this.options)
  }
}

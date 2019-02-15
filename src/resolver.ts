import { ITagInput } from './tokenize'
import { Scope, getKeys } from './get'
import { isFunction, assertType } from './util'
import { IStringifyOptions, stringifyTagParams } from './stringify'
import { toPath } from './to-path'

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

export interface IResolverOptions extends IStringifyOptions {
  resolveFnContext?: any
}

export class Resolver {
  private cache: {
    [path: string]: string[]
  } = {}

  constructor(private tokens: ITagInput, private options: IResolverOptions) {}

  private callResolver(scope: Scope, resolveFn?: ResolveFn) {
    if (resolveFn === undefined) {
      return this.callDefaultResolver(scope)
    }
    assertType(
      isFunction(resolveFn),
      'Expected a resolver (async) function but got',
      resolveFn
    )
    return this.tokens.values.map(varName =>
      (resolveFn as ResolveFn).call(
        this.options.resolveFnContext,
        varName,
        scope
      )
    )
  }

  private callDefaultResolver(scope: Scope) {
    return this.tokens.values.map(varName => {
      let pathsArr = this.cache[varName]
      if (pathsArr === undefined) {
        pathsArr = this.cache[varName] = toPath(varName)
      }
      return getKeys(scope, pathsArr)
    })
  }

  public render(scope: Scope = {}, resolveFn?: ResolveFn): string {
    const values = this.callResolver(scope, resolveFn)
    return stringifyTagParams(this.tokens.strings, values, this.options)
  }

  public async renderAsync(
    scope: Scope = {},
    resolveFn?: ResolveFn
  ): Promise<string> {
    const values = await Promise.all(this.callResolver(scope, resolveFn))
    return stringifyTagParams(this.tokens.strings, values, this.options)
  }
}

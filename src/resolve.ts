import { ITagInput, NameToken } from './tokenize'
import { Scope, getKeys } from './get'
import { assertTruthy, isFunction, asyncMap } from './util'
import { IStringifyOptions, stringifyTagParams } from './stringify'
import { Renderer, AsyncRenderer } from './render'

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
export type Resolver = (
  varName: string,
  scope?: Scope,
  nameToken?: NameToken
) => any

export type AsyncResolver = (
  varName: string,
  scope?: Scope,
  nameToken?: NameToken
) => Promise<any>

export interface IResolveOptions extends IStringifyOptions {
  resolver?: Resolver | AsyncResolver
  resolverContext?: any
}

const defaultResolver: Resolver = (
  varName: string,
  scope: Scope,
  nameToken: NameToken
) => getKeys(scope, nameToken.paths)

export function callResolver(
  scope: Scope,
  tokens: ITagInput<NameToken>,
  resolver: Resolver,
  resolverContext: any,
  options: IStringifyOptions
) {
  const values = tokens.values.map(nameToken =>
    resolver.call(resolverContext, nameToken.varName, scope, nameToken)
  )
  return stringifyTagParams(tokens.strings, values, options)
}

export async function callAsyncResolver(
  scope: Scope,
  tokens: ITagInput<NameToken>,
  resolver: AsyncResolver,
  resolverContext: any,
  options: IStringifyOptions
) {
  const values = await asyncMap(tokens.values, nameToken =>
    resolver.call(resolverContext, nameToken.varName, scope, nameToken)
  )
  return stringifyTagParams(tokens.strings, values, options)
}

export function createRenderer(
  tokens: ITagInput<NameToken>,
  options: IResolveOptions
): Renderer {
  const { resolver = defaultResolver, resolverContext } = options

  assertTruthy(
    isFunction(resolver),
    `Expected a resolver function but got ${resolver}`,
    TypeError
  )

  return function renderer(scope: Scope = {}) {
    return callResolver(scope, tokens, resolver, resolverContext, options)
  }
}

export function createAsyncRenderer(
  tokens: ITagInput<NameToken>,
  options: IResolveOptions
): AsyncRenderer {
  const { resolver, resolverContext } = options

  assertTruthy(
    isFunction(resolver),
    `Expected a resolver (async) function but got ${resolver}`,
    TypeError
  )

  return function renderer(scope: Scope = {}) {
    return callAsyncResolver(
      scope,
      tokens,
      resolver as AsyncResolver,
      resolverContext,
      options
    )
  }
}

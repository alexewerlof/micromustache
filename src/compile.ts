import { isObject, isFunction, assertTruthy, asyncMap, isDefined } from './util'
import { getKeys } from './get'
import {
  ICompilerOptions,
  Renderer,
  Resolver,
  Scope,
  TokenType,
  AsyncRenderer,
  AsyncResolver
} from './types'
import { tokenize, NameToken } from './tokenize'
import { stringifyValues } from './stringify'

const defaultResolver: Resolver = (
  varName: string,
  scope: Scope,
  nameToken: NameToken
) => getKeys(scope, nameToken.paths)

function callResolver(
  resolver: Resolver | AsyncResolver,
  scope: {},
  token: TokenType,
  resolverContext: any = null
) {
  // token is a string but paths is a flag saying that it is actually a variable name and needs interpolation
  if (token instanceof NameToken) {
    return resolver.call(resolverContext, token.varName, scope, token)
  }
  return token as string
}

/**
 * This function makes repeated calls shorter by returning a compiler function
 * for a particular template that accepts scope and returns the rendered string.
 *
 * It doesn't make the code faster since the compiler still uses render
 * internally.
 *
 * @param template same as the template parameter to .render()
 * @param resolver an optional function that receives a token and synchronously returns a value
 * @param options compiler options
 * @returns a function that accepts a scope object and returns a
 *        rendered template string template
 */
export function compile(
  template: string,
  options: ICompilerOptions = {}
): Renderer {
  // Note: tokenize() asserts the type of its params
  const tokens = tokenize(template, options)

  const { resolver = defaultResolver } = options

  assertTruthy(
    isFunction(resolver),
    `Expected a resolver function but got ${resolver}`,
    TypeError
  )

  return function renderer(scope: Scope = {}) {
    const resolvedTokens = tokens.map(token =>
      callResolver(resolver, scope, token, options.resolverContext)
    )
    return stringifyValues(resolvedTokens, options)
  }
}

export function compileAsync(
  template: string,
  options: ICompilerOptions = {}
): AsyncRenderer {
  // Note: tokenize() asserts the type of its params
  const tokens = tokenize(template, options)

  const { resolver } = options

  assertTruthy(
    isFunction(resolver),
    `Expected a resolver async function but got ${resolver}`,
    TypeError
  )

  return async function asyncRenderer(scope: Scope = {}) {
    const resolvedTokens = await asyncMap(tokens, token =>
      callResolver(
        resolver as AsyncResolver,
        scope,
        token,
        options.resolverContext
      )
    )
    return stringifyValues(resolvedTokens, options)
  }
}

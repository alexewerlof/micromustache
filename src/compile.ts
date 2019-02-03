import { isObject, isFunction, assertTruthy, asyncMap, isDefined } from './util'
import { getKeys } from './get'
import { ICompilerOptions, Renderer, Resolver, Scope, TokenType } from './types'
import { tokenize, NameToken } from './tokenize'
import { stringifyValues } from './stringify'

function defaultResolver(scope: Scope, token: NameToken) {
  return getKeys(scope, token.paths)
}

function resolveToken(resolve: Resolver, scope: {}, token: TokenType) {
  // token is a string but paths is a flag saying that it is actually a variable name and needs interpolation
  if (token instanceof NameToken) {
    return resolve(scope, token)
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
 * @param options compiler options
 * @returns a function that accepts a scope object and returns a
 *        rendered template string template
 */
export function compile(
  template: string,
  options: ICompilerOptions = {}
): Renderer {
  // don't touch the template if it is not a string
  assertTruthy(
    isObject(options),
    `When a options are provided, it should be an object. Got ${options}`
  )

  // Note: tokenize() also asserts that options is an object
  const tokens = tokenize(template, options)
  let { resolver } = options

  if (isDefined(resolver)) {
    assertTruthy(
      isFunction(resolver),
      `The resolver is not a function. Got ${resolver}`
    )
  } else {
    resolver = defaultResolver
  }

  if (options.asyncResolver) {
    return async function asyncRenderer(scope: Scope = {}) {
      const resolvedToken = await asyncMap(tokens, token =>
        resolveToken(resolver as Resolver, scope, token)
      )
      return stringifyValues(resolvedToken, options)
    }
  }

  return function renderer(scope: Scope = {}) {
    const resolvedToken = tokens.map(token =>
      resolveToken(resolver as Resolver, scope, token)
    )
    return stringifyValues(resolvedToken, options)
  }
}

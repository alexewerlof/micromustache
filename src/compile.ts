import { isFunction, assertTruthy, asyncMap } from './util'
import { Scope, getKeys } from './get'
import { ITokenizeOptions, NameToken, tokenizeTemplate } from './tokenize'
import { IStringifyOptions, stringifyTagParams } from './stringify'

/**
 * @param scope - An optional object containing values for
 *        every variable names that is used in the template. If it's omitted,
 *        it'll be assumed an empty object.
 * @returns Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
export type Renderer = (scope: Scope) => string
export type AsyncRenderer = (scope: Scope) => Promise<string>

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

export interface ICompilerOptions extends ITokenizeOptions, IStringifyOptions {
  resolver?: Resolver | AsyncResolver
  resolverContext?: any
}

const defaultResolver: Resolver = (
  varName: string,
  scope: Scope,
  nameToken: NameToken
) => getKeys(scope, nameToken.paths)

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
  // Note: parseString() asserts the type of its params
  const tokens = tokenizeTemplate(template, options)

  const { resolver = defaultResolver } = options

  assertTruthy(
    isFunction(resolver),
    `Expected a resolver function but got ${resolver}`,
    TypeError
  )

  return function renderer(scope: Scope = {}) {
    const values = tokens.values.map(nameToken =>
      (resolver as Resolver).call(
        options.resolverContext,
        nameToken.varName,
        scope,
        nameToken
      )
    )
    return stringifyTagParams(tokens.strings, values, options)
  }
}

export function compileAsync(
  template: string,
  options: ICompilerOptions = {}
): AsyncRenderer {
  // Note: parseString() asserts the type of its params
  const tokens = tokenizeTemplate(template, options)

  const { resolver } = options

  assertTruthy(
    isFunction(resolver),
    `Expected a resolver async function but got ${resolver}`,
    TypeError
  )

  return async function asyncRenderer(scope: Scope = {}) {
    const values = await asyncMap(tokens.values, nameToken =>
      (resolver as AsyncResolver).call(
        options.resolverContext,
        nameToken.varName,
        scope,
        nameToken
      )
    )
    return stringifyTagParams(tokens.strings, values, options)
  }
}

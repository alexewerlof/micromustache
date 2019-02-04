import { NameToken } from './tokenize'

export type Scope = {} | Function

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

export type TokenType = NameToken | string

export interface ITokenizeOptions {
  /** the string that indicates opening a variable interpolation expression */
  openSymbol?: string
  /** the string that indicates closing a variable interpolation expression */
  closeSymbol?: string
}

export interface IStringifyOptions {
  /** an optional string to be used when the value is an unsupported type */
  invalidType?: string
  /** an optional string to be used when JSON.stringify fails */
  invalidObj?: string
}

export interface ICompilerOptions extends ITokenizeOptions, IStringifyOptions {
  resolver?: Resolver | AsyncResolver
  resolverContext?: any
}

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

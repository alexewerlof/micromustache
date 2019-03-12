import {
  Renderer,
  ResolveFn,
  ResolveFnAsync,
  IRendererOptions
} from './renderer'
import { Scope } from './get'
import { assertType, isString, isObject } from './util'
import { tokenize } from './tokenize'

export * from './get'
export * from './renderer'
export * from './tokenize'

export interface ICompileOptions extends IRendererOptions {
  openSym?: string
  closeSym?: string
}

/**
 * This function makes repeated calls more optimized by compiling once and
 * returning a class that can do the rendering for you.
 *
 * @param template - same as the template parameter to .render()
 * @param resolver - an optional function that receives a token and
 * synchronously returns a value
 * @param renderNullAndUndefined - should we render null as 'null' and undefined
 * as 'undefined'
 * @returns - an object with render() and renderFnAsync() functions that accepts
 * a scope object and return the final string
 */
export function compile(
  template: string,
  options: ICompileOptions = {}
): Renderer {
  assertType(
    isString(template),
    'The template parameter must be a string. Got',
    template
  )
  assertType(
    isObject(options),
    'The compiler options should be an object. Got',
    options
  )

  const { strings, varNames } = tokenize(
    template,
    options.openSym,
    options.closeSym
  )
  return new Renderer(strings, varNames, options)
}

/**
 * Replaces every {{variable}} inside the template with values provided by scope.
 *
 * @param template - The template containing one or more {{variableNames}} every variable
 *        names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param scope - An object containing values for every variable names that is used in
 *        the template. If it's omitted and empty object will be assumed.
 * @param renderNullAndUndefined - should we render null as 'null' and undefined as 'undefined'
 * @returns - Template where its variable names replaced with
 *        corresponding values. If a value is not found or is invalid, it will
 *        be assumed empty string ''. If the value is an object itself, it'll
 *        be stringified by JSON.
 *        In case of a JSON stringify error the result will look like "{...}".
 */
export function render(
  template: string,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.render(scope)
}

/**
 * Same as render() but calls the resolver asynchronously
 */
export function renderFn(
  template: string,
  resolveFn: ResolveFn,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.renderFn(resolveFn, scope)
}

/**
 * Same as render() but calls the resolver asynchronously
 */
export async function renderFnAsync(
  template: string,
  resolveFnAsync: ResolveFnAsync,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.renderFnAsync(resolveFnAsync, scope)
}

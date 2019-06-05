import { Renderer, ResolveFn, ResolveFnAsync } from './renderer'
import { Scope } from './get'
import { compile, ICompileOptions } from './compile'

/**
 * Replaces every {{varName}} inside the template with values from the scope
 * parameter.
 *
 * @param template The template containing one or more {{variableName}} as
 * placeholders for values from the `scope` parameter.
 * @param scope An object containing values for variable names from the the
 * template. If it's omitted, we default to an empty object.
 * @throws any error that [[compile]] or [[Renderer.render]] may throw
 * @returns Template where its variable names replaced with
 * corresponding values.
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
 * Same as [[render]] but accepts a resolver function which will be responsible
 * for returning a value for every varName.
 * @throws any error that [[compile]] or [[Renderer.renderFn]] may throw
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
 * Same as [[renderFn]] but only works with asynchronous resolver functions
 * (a function that returns a promise instead of the value).
 * @throws any error that [[compile]] or [[Renderer.renderFnAsync]] may throw
 */
export function renderFnAsync(
  template: string,
  resolveFnAsync: ResolveFnAsync,
  scope?: Scope,
  options?: ICompileOptions
) {
  const renderer: Renderer = compile(template, options)
  return renderer.renderFnAsync(resolveFnAsync, scope)
}

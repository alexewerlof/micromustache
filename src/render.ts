import { Renderer, ResolveFn, ResolveFnAsync } from './renderer'
import { Scope } from './get'
import { compile, ICompileOptions } from './compile'

/**
 * Replaces every {{varName}} inside the template with values from the scope
 * parameter.
 * @warning **When dealing with user input, always make sure to validate it.**
 * @param template The template containing one or more {{varName}} as
 * placeholders for values from the `scope` parameter.
 * @param scope An object containing values for variable names from the the
 * template. If it's omitted, we default to an empty object.
 * Since functions are objects in javascript, the `scope` can technically be a
 * function too but it won't be called. It'll be treated as an object and its
 * properties will be used for the lookup.
 * @param options same options as the [[compile]] function
 * @throws any error that [[compile]] or [[Renderer.render]] may throw
 * @returns Template where its variable names replaced with
 * corresponding values.
 */
export function render(template: string, scope?: Scope, options?: ICompileOptions): string {
  const renderer: Renderer = compile(template, options)
  return renderer.render(scope)
}

/**
 * Same as [[render]] but accepts a resolver function which will be responsible
 * for returning a value for every varName.
 * @param resolveFn a function that takes a variable name and resolves it to a value.
 * The value can be a number, string or boolean. If it is not, it'll be "stringified".
 * @throws any error that [[compile]] or [[Renderer.renderFn]] may throw
 * @returns Template where its variable names replaced with what is returned from the resolver
 * function for each varName.
 */
export function renderFn(
  template: string,
  resolveFn: ResolveFn,
  scope?: Scope,
  options?: ICompileOptions
): string {
  const renderer: Renderer = compile(template, options)
  return renderer.renderFn(resolveFn, scope)
}

/**
 * Same as [[renderFn]] but supports asynchronous resolver functions
 * (a function that returns a promise instead of the value).
 * @param resolveFn an async function that takes a variable name and resolves it to a value.
 * The value can be a number, string or boolean. If it is not, it'll be "stringified".
 * @throws any error that [[compile]] or [[Renderer.renderFnAsync]] may throw
 * @returns a promise that when resolved contains the template where its variable names replaced
 * with what is returned from the resolver function for each varName.
 */
export function renderFnAsync(
  template: string,
  resolveFnAsync: ResolveFnAsync,
  scope?: Scope,
  options?: ICompileOptions
): Promise<string> {
  const renderer: Renderer = compile(template, options)
  return renderer.renderFnAsync(resolveFnAsync, scope)
}

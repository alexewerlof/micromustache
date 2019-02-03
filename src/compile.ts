import { isObject, isFunction, isString, assertTruthy } from './util';
import { get } from './get';
import { ICompilerOptions, Renderer, ResolverFn, TokenType } from './types';
import { tokenize, Token } from './tokenize';
import { stringify } from './stringify';

/**
 * This function makes repeated calls shorter by returning a compiler function
 * for a particular template that accepts view and returns the rendered string.
 *
 * It doesn't make the code faster since the compiler still uses render
 * internally.
 *
 * @param template - same as the template parameter to .render()
 * @param options - compiler options
 * @returns {Renderer} - a function that accepts a view object and returns a
 *        rendered template string template
 */
export function compile(template: string, options: ICompilerOptions = {}): Renderer {
  // don't touch the template if it is not a string
  assertTruthy(isObject(options), `When a options are provided, it should be an object. Got ${options}`);
  assertTruthy(isString(template), `Template must be a string. Got ${template}`);

  // Create and return a function that will always apply this template
  // and resolver under the hood
  const tokens = tokenize(template, options)

  const resolver = options.resolver as ResolverFn
  const useCustomResolver = isFunction(resolver);
  return function renderer(view: {} = {}) {
    return tokens.map(token => {
      // token is a string but paths is a flag saying that it is actually a variable name and needs interpolation
      if (token instanceof Token) {
        const value = useCustomResolver ? resolver(view, token.varName) : get(view, token.paths);
        return stringify(value, options)
      }
      return token as string
    }).join('')
  }
}

import { tokenize, ITokenizeOptions } from './tokenize'
import { Renderer, IRendererOptions } from './render'
import { CachedFn } from './util'

export interface ICompileOptions extends ITokenizeOptions, IRendererOptions {}

const cachedTokenize = new CachedFn(tokenize, 10)

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
export function compile(template: string, options?: ICompileOptions): Renderer {
  // Note: tokenize() asserts the type of its params
  const { strings, varNames } = options
    ? tokenize(template, options)
    : cachedTokenize.obtain(template)
  return new Renderer(strings, varNames, options)
}

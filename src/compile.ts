import { IParseOptions, tokenize } from './tokenize'
import { IRendererOptions, Renderer } from './render'

export type ICompileOptions = IParseOptions & IRendererOptions

/**
 * This function makes repeated calls more optimized by compiling once and
 * returning a class that can do the rendering for you.
 *
 * @param template - same as the template parameter to .render()
 * @param resolver - an optional function that receives a token and synchronously returns a value
 * @param options - compiler options
 * @returns - an object with render() and renderFnAsync() functions that accepts a scope object and
 * return the final string
 */
export function compile(template: string, options?: ICompileOptions): Renderer {
  // Note: tokenize() asserts the type of its params
  const tokens = tokenize(template, options)
  return new Renderer(tokens, options)
}

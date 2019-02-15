import { IParseOptions, tokenize, Template, TagFn } from './tokenize'
import { IStringifyOptions } from './stringify'
import { IRendererOptions, Renderer } from './renderer'

export interface ICompilerOptions
  extends IParseOptions,
    IStringifyOptions,
    IRendererOptions {}

/**
 * This function makes repeated calls more optimized by compiling once and
 * returning a class that can do the rendering for you.
 *
 * @param template - same as the template parameter to .render()
 * @param resolver - an optional function that receives a token and synchronously returns a value
 * @param options - compiler options
 * @returns - an object with render() and renderAsync() functions that accepts a scope object and
 * return the final string
 */
export function compile(
  template: Template,
  options: ICompilerOptions = {}
): Renderer {
  // Note: parseString() asserts the type of its params
  const tokens = tokenize(template, options)
  return new Renderer(tokens, options)
}

/**
 * This function is the same as compile() but works as a tag function for string literals.
 * @param options - same as compiler options
 * @returns - an object with render() and renderAsync() functions that accepts a scope object and
 * return the final string
 */
export function compileTag(options: ICompilerOptions): TagFn<Renderer> {
  return function tag(strings: string[], ...values: any): Renderer {
    return compile({ strings, values }, options)
  }
}

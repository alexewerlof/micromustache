import { IParseOptions, tokenizeTemplate } from './tokenize'
import { IStringifyOptions } from './stringify'
import { IResolveOptions, createRenderer, createAsyncRenderer } from './resolve'
import { AsyncRenderer, Renderer } from './render'

export interface ICompilerOptions
  extends IParseOptions,
    IStringifyOptions,
    IResolveOptions {}

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
  return createRenderer(tokens, options)
}

export function compileAsync(
  template: string,
  options: ICompilerOptions = {}
): AsyncRenderer {
  // Note: parseString() asserts the type of its params
  const tokens = tokenizeTemplate(template, options)
  return createAsyncRenderer(tokens, options)
}

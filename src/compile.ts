import { Renderer, IRendererOptions } from './renderer'
import { isString, isObject } from './util'
import { tokenize } from './tokenize'

export type Tags = [string, string]

/**
 * The options that customize the tokenization of the template and the renderer
 * object that is returned
 */
export interface ICompileOptions extends IRendererOptions {
  /**
   * The string symbols that mark the opening and closing of a variable name in
   * the template.
   * It defaults to `['{{', '}}']`
   */
  tags?: Tags
}

/**
 * Compiles a template and returns an object with functions that render it.
 * Compilation makes repeated render calls more optimized by parsing the
 * template only once and reusing the results.
 * As a result, rendering gets 3-5x faster.
 * Caching is stored in the resulting object, so if you free up all the
 * references to that object, the caches will be garbage collected.
 *
 * @param template - same as the template parameter to .render()
 * @param options - some options for customizing the compilation
 * @returns - an object with some methods that can do the actual rendering
 */
export function compile(
  template: string,
  options: ICompileOptions = {}
): Renderer {
  if (!isString(template)) {
    throw new TypeError(
      'The template parameter must be a string. Got ' + template
    )
  }
  if (!isObject(options)) {
    throw new TypeError(
      'The compiler options should be an object. Got ' + options
    )
  }

  const { tags = ['{{', '}}'] } = options

  const tokens = tokenize(template, ...tags)
  return new Renderer(tokens, options)
}

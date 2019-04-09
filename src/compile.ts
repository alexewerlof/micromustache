import { Renderer, IRendererOptions } from './renderer'
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

const defaultTags: Tags = ['{{', '}}']
const defaultCompileOptions: ICompileOptions = {}

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
  options: ICompileOptions = defaultCompileOptions
): Renderer {
  if (typeof template !== 'string') {
    throw new TypeError(
      'The template parameter must be a string. Got ' + template
    )
  }
  if (options === null || typeof options !== 'object') {
    throw new TypeError(
      'The compiler options should be an object. Got ' + options
    )
  }

  const { tags = defaultTags } = options

  if (!Array.isArray(tags) || tags.length !== 2) {
    throw Error('Tags should be an array with exactly two items. Got ' + tags)
  }

  const tokens = tokenize(template, tags[0], tags[1])
  return new Renderer(tokens, options)
}

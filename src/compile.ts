import { Renderer, RendererOptions } from './renderer'
import { tokenize, TokenizeOptions } from './tokenize'

/**
 * The options that customize the tokenization of the template and the renderer
 * object that is returned
 */
export interface CompileOptions extends RendererOptions, TokenizeOptions {}

/**
 * Compiles a template and returns an object with functions that render it.
 * Compilation makes repeated render calls more optimized by parsing the
 * template only once and reusing the results.
 * As a result, rendering gets 3-5x faster.
 * Caching is stored in the resulting object, so if you free up all the
 * references to that object, the caches will be garbage collected.
 *
 * @param template same as the template parameter to .render()
 * @param options some options for customizing the compilation
 * @throws `TypeError` if the template is not a string
 * @throws `TypeError` if the options is set but is not an object
 * @throws any error that [[tokenize]] or [[Renderer.constructor]] may throw
 * @returns a [[Renderer]] object which has render methods
 */
export function compile(template: string, options: CompileOptions = {}): Renderer {
  const tokens = tokenize(template, options)
  return new Renderer(tokens, options)
}

import { Renderer, IRendererOptions } from './renderer'
import { assertType, isString, isObject } from './util'
import { tokenize } from './tokenize'

/** The options that customize the compilation and parsing of the template */
export interface ICompileOptions extends IRendererOptions {
  /** The opening symbol. Defaults to '{{' (`tag` in Mustache terminology) */
  openSym?: string
  /** The closing symbol. Defaults to '}}' (`tag` in Mustache terminology) */
  closeSym?: string
}

/**
 * Compiles a template and returns an object with functions that can render it.
 * Compilation makes repeated render calls more optimized by parsing the
 * template only once and reusing it.
 * It also makes the rendering faster (3-5x faster).
 * All caching is in the resulting object, so if you free up all the references
 * to that object, the memory will be garbage collected.
 *
 * @param template - same as the template parameter to .render()
 * @param options - some options for customizing the compilation
 * @returns - an object with some methods that can do the actual rendering
 */
export function compile(
  template: string,
  options: ICompileOptions = {}
): Renderer {
  assertType(
    isString(template),
    'The template parameter must be a string. Got',
    template
  )
  assertType(
    isObject(options),
    'The compiler options should be an object. Got',
    options
  )

  const tokens = tokenize(template, options.openSym, options.closeSym)
  return new Renderer(tokens, options)
}

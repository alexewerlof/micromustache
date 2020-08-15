import { parseTemplate, ParseTemplateOptions } from './parse'
import { tokenizePath, Ref, TokenizePathOptions } from './tokenize'

/**
 * This is the result of compilation.
 * It contains the "constant" strings of the template as well as the parsed version of paths in
 * between.
 */
export interface TokenizedTemplate {
  /**
   * Contains the "constant" parts of the template
   * @example For `'Hi {{person.name}}!'`, `strings` is `['Hi ', '!']`
   */
  strings: string[]
  /**
   * The parsed path which is called a "Ref" in micromustache lingo. Each Ref is one array of
   * strings.
   * @example For `'Hi {{person.firstName}} {{person.lastName}}!'`, there are two paths:
   * - `'person.firstName'` which gives us `['person', 'firstName']` as a Ref
   * - `'person.lastName'` which gives us `['person', 'lastName']` as a Ref
   *
   * Therefore the `refs` property will be `[['person', 'firstName'], ['person', 'lastName']`
   */
  refs: Ref[]
}

/**
 * The options that customize parsing the template and tokenizing the paths
 */
export interface CompileOptions extends ParseTemplateOptions, TokenizePathOptions {}

/**
 * Parses the template and tokenizes the paths.
 * If you don't want to tokenize the paths (for example if they are not expected to hold valid
 * JavaScript object accessors, you can use the [[parseTemplate]] function instead).
 * Compilation makes repeated render calls more performant because you are practically parsing the
 * template only once. Rendering is usually 3-5x faster.
 *
 * Caching is stored in the resulting object, so if you free up all the references to that object,
 * the caches will be garbage collected.
 *
 * @param template same as the template parameter to [[render]]
 * @param options some options for customizing the parsing and tokenization
 * @throws any error that the [[parseTemplate]] or [[tokenizePath]] may throw
 * @returns an object with `'strings'` and `'refs'` properties that can be used together with
 * [[getRef]] and [[stringify]] to compile the code.
 */
export function compile(template: string, options: CompileOptions = {}): TokenizedTemplate {
  // No assertion is required here because these internal functions assert their input
  const { strings, paths } = parseTemplate(template, options)
  const refs = paths.map((path) => tokenizePath.cached(path, options))
  return { strings, refs }
}

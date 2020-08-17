import { parseTemplate, ParseTemplateOptions, ParsedTemplate } from './parse'
import { tokenizePath, Ref, TokenizePathOptions } from './tokenize'
import { transform } from './transform'

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
 * [[refGet]] and [[stringify]] to compile the code.
 */
export function compile(template: string, options: CompileOptions = {}): ParsedTemplate<Ref> {
  // No assertion is required here because these internal functions assert their input
  return transform(parseTemplate(template, options), (path) => tokenizePath.cached(path, options))
}

import { parse, ParseOptions } from './parse'
import { pathToRef, Ref, PathToRefOptions } from './tokenize'

/**
 * The options that customize parsing the template and tokenizing the paths.
 * Since [[compile]] calls [[parse]] and [[pathToRef]] functions internally, its accepts
 * any options to those objects
 */
export interface CompileOptions extends ParseOptions, PathToRefOptions {}

export interface CompiledTemplate {
  strings: string[]
  refs: Ref[]
}
/**
 * Parses the template and tokenizes its `path`s.
 *
 * If you don't want to tokenize the paths (for example if they are not expected to hold valid
 * JavaScript object references, you can use the [[parse]] function instead).
 * Compilation makes repeated render calls (2-7 times faster).
 *
 * The result can be directly passed to the [[render]], [[renderFn]] or [[renderFnAsync]] functions
 * instead of the raw template string.
 *
 * Caching is stored in the resulting object, so if you free up all the references to that object,
 * the caches will be garbage collected.
 *
 * @param template same as the template parameter to [[render]]
 * @param options some options for customizing the parsing and tokenization
 *
 * @returns an object with `'strings'` and `'refs'` properties that can be used together with
 * [[refGet]] and [[stringify]] to compile the code.
 *
 * @throws any error that the [[parse]] or [[pathToRef]] may throw
 */
export function compile(template: string, options: CompileOptions = {}): CompiledTemplate {
  // No assertion is required here because these internal functions assert their input
  const { strings, subs } = parse(template, options)
  return { strings, refs: subs.map((path) => pathToRef.cached(path, options)) }
}

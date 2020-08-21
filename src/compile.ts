import { parse, ParseOptions, isParsedTemplate, ParsedTemplate } from './parse'
import { pathToRef, Ref, PathToRefOptions } from './ref'
import { isObj, isArr, isStr } from './utils'

/**
 * The options that customize parsing the template and tokenizing the paths.
 * Since [[compile]] calls [[parse]] and [[pathToRef]] functions internally, its accepts
 * any options to those objects
 */
export interface CompileOptions extends ParseOptions, PathToRefOptions {}

export interface CompiledTemplate {
  /**
   * See the `strings` property of [[ParsedOptions]]
   */
  readonly strings: string[]
  /**
   * The paths of the template converted to [[Ref]] objects
   */
  readonly refs: Ref[]
}

export function isCompiledTemplate(x: unknown): x is CompiledTemplate {
  if (!isObj(x)) {
    return false
  }

  const { strings, refs } = x as CompiledTemplate

  return isArr(strings) && isArr(refs) && strings.length === refs.length + 1
}

/**
 * Parses the template and converts its `path`s to ref arrays.
 *
 * If you don't want to tokenize the paths (for example if they are not expected to hold valid
 * JavaScript object references, you can use the [[parse]] function instead).
 * Compilation makes repeated render calls (2-7 times faster).
 *
 * The result can be directly passed to the [[render]] or [[resolve]] functions
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
export function compile(
  template: string | ParsedTemplate<string>,
  options: CompileOptions = {}
): CompiledTemplate {
  // No assertion is required here because these internal functions assert their input
  let parsedTemplate
  if (isStr(template)) {
    parsedTemplate = parse(template, options)
  } else if (isParsedTemplate(template)) {
    parsedTemplate = template
  } else {
    throw new TypeError(`compile() expected a string or ParsedTemplate. Got: ${template}`)
  }
  const { strings, subs } = parsedTemplate
  return { strings, refs: subs.map((path) => pathToRef.cached(path, options)) }
}

import { IParseOptions, tokenize, Template, TagFn } from './tokenize'
import { IStringifyOptions } from './stringify'
import { IResolverOptions, Resolver } from './resolver'

export interface ICompilerOptions
  extends IParseOptions,
    IStringifyOptions,
    IResolverOptions {}

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
): Resolver {
  // Note: parseString() asserts the type of its params
  const tokens = tokenize(template, options)
  return new Resolver(tokens, options)
}

/**
 * This function is the same as compile() but works as a tag function for string literals.
 * @param options - same as compiler options
 * @returns - an object with render() and renderAsync() functions that accepts a scope object and
 * return the final string
 */
export function compileTag(options: ICompilerOptions): TagFn<Resolver> {
  return function tag(strings: string[], ...values: any): Resolver {
    return compile({ strings, values }, options)
  }
}

import { Renderer, IRendererOptions } from './renderer'
import { assertType, isString, isObject } from './util'
import { tokenize } from './tokenize'

export interface ICompileOptions extends IRendererOptions {
  openSym?: string
  closeSym?: string
}

/**
 * This function makes repeated calls more optimized by compiling once and
 * returning a class that can do the rendering for you.
 *
 * @param template - same as the template parameter to .render()
 * @param resolver - an optional function that receives a token and
 * synchronously returns a value
 * @param renderNullAndUndefined - should we render null as 'null' and undefined
 * as 'undefined'
 * @returns - an object with render() and renderFnAsync() functions that accepts
 * a scope object and return the final string
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

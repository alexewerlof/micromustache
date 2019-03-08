import { tokenize } from './tokenize'
import { Renderer } from './render'

/**
 * This function makes repeated calls more optimized by compiling once and
 * returning a class that can do the rendering for you.
 *
 * @param template - same as the template parameter to .render()
 * @param resolver - an optional function that receives a token and synchronously returns a value
 * @param options - compiler options
 * @returns - an object with render() and renderFnAsync() functions that accepts a scope object and
 * return the final string
 */
export function compile(
  template: string,
  renderNullAndUndefined?: boolean
): Renderer {
  // Note: tokenize() asserts the type of its params
  const { strings, varNames } = tokenize(template)
  return new Renderer(strings, varNames, renderNullAndUndefined)
}

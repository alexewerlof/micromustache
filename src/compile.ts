import { tokenize } from './tokenize'
import { Renderer, IRendererOptions } from './render'
import { CachedFn, isObject, assertType, isString } from './util'

export interface ICompileOptions extends IRendererOptions {
  openSym: string
  closeSym: string
}

export class Compiler {
  private static cachedTokenize = new CachedFn(tokenize, 10)
  private customOpenCloseSym = false

  constructor(private template: string, private options?: ICompileOptions) {
    assertType(
      isString(template),
      'The template parameter must be a string. Got',
      template
    )
    if (options !== undefined) {
      assertType(
        isObject(options),
        'The compiler options should be an object. Got',
        options
      )
      this.customOpenCloseSym =
        options.openSym !== '{{' || options.closeSym !== '}}'
    }
  }

  public getTokens() {
    return this.customOpenCloseSym
      ? tokenize(
          this.template,
          (this.options as ICompileOptions).openSym,
          (this.options as ICompileOptions).closeSym
        )
      : Compiler.cachedTokenize.obtain(this.template)
  }

  public createRenderer() {
    const { strings, varNames } = this.getTokens()
    return new Renderer(strings, varNames, this.options)
  }
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
export function compile(template: string, options?: ICompileOptions): Renderer {
  const compiler = new Compiler(template, options)
  return compiler.createRenderer()
}

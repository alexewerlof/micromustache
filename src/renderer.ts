import { ITagInput, TagFn } from './tokenize'
import { Scope, getKeys } from './get'
import { isFunction, assertType } from './util'
import { IStringifyOptions, stringify } from './stringify'
import { toPath } from './to-path'
import { compileTag } from './compile'
import { isObject } from 'util'

/**
 * The callback for resolving a value
 * @param view - the view object that was passed to .render() function
 * @param path - variable name before being parsed.
 * @example {a.b.c} ->  'a.b.c'
 * @example {  x  } -> 'x'
 * @returns the value to be interpolated.
 * If the function returns undefined, the value resolution algorithm will go ahead with the default
 * behaviour (resolving the variable name from the provided object).
 */
export type ResolveFn = (varName: string, scope?: Scope) => any | Promise<any>

export interface IRendererOptions extends IStringifyOptions {
  resolveFnContext?: any
}

export class Renderer {
  private cache: {
    [path: string]: string[]
  } = {}

  private assembleCache: string[]

  constructor(
    private tokens: ITagInput,
    private options: IRendererOptions = {}
  ) {
    assertType(
      isObject(options),
      'If options is passed, it should be an object. Got',
      options
    )
    const lastStringIndex = tokens.values.length
    this.assembleCache = new Array(lastStringIndex * 2 + 1)
    tokens.strings.forEach((s, i) => (this.assembleCache[i * 2] = s))
  }

  private assembleResults(values: any[]): string {
    values.forEach((v, i) => {
      this.assembleCache[i * 2 + 1] = stringify(v, this.options)
    })
    return this.assembleCache.join('')
  }

  private callResolver(scope: Scope, resolveFn: ResolveFn): any[] {
    assertType(
      isFunction(resolveFn),
      'Expected a resolver (async) function but got',
      resolveFn
    )
    return this.tokens.values.map(varName =>
      resolveFn.call(this.options.resolveFnContext, varName, scope)
    )
  }

  private callDefaultResolver(scope: Scope) {
    return this.tokens.values.map(varName => {
      let pathsArr = this.cache[varName]
      if (pathsArr === undefined) {
        pathsArr = this.cache[varName] = toPath(varName)
      }
      return getKeys(scope, pathsArr)
    })
  }

  public render(
    scope: Scope = {},
    resolveFn: ResolveFn = this.options.resolveFnContext
  ): string {
    const values = resolveFn
      ? this.callResolver(scope, resolveFn)
      : this.callDefaultResolver(scope)
    return this.assembleResults(values)
  }

  public async renderAsync(
    scope: Scope = {},
    resolveFn: ResolveFn
  ): Promise<string> {
    const values = await Promise.all(this.callResolver(scope, resolveFn))
    return this.assembleResults(values)
  }
}

export function renderTag(
  scope: Scope,
  options?: IRendererOptions
): TagFn<string> {
  return function tag(strings: string[], ...values: any): string {
    const renderer = new Renderer({ strings, values }, options)
    return renderer.render(scope)
  }
}

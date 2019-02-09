import { guessCloseSymbol } from './util'
import { ICompilerOptions, compile } from './compile'
import { Resolver } from './resolver'
import { render, asyncRender } from './render'
import { Scope } from './get'

export type TagFn<T> = (strings: string[], ...values: any) => T

export function toTemplate(strings: string[], ...values: any) {
  return toTemplateOpt()(strings, ...values)
}

// TODO add types
export function toTemplateOpt(
  openSymbol = '{{',
  closeSymbol = guessCloseSymbol(openSymbol)
) {
  return function convertToTemplate(strings: string[], ...values: any) {
    const lastStringIndex = strings.length - 1
    const ret: string[] = new Array(lastStringIndex * 4 + 1)
    for (let i = 0; i < lastStringIndex; i++) {
      ret.push(strings[i])
      ret.push(openSymbol)
      ret.push(values[i])
      ret.push(closeSymbol)
    }

    ret.push(strings[lastStringIndex])
    return ret.join('')
  }
}

export function compileTag(options: ICompilerOptions): TagFn<Resolver> {
  return function tag(strings: string[], ...values: any): Resolver {
    return compile({ strings, values }, options)
  }
}

export function renderTag(
  scope: Scope,
  options: ICompilerOptions
): TagFn<string> {
  return function tag(strings: string[], ...values: any): string {
    return render({ strings, values }, scope, options)
  }
}

export function asyncRenderTag(
  scope: Scope,
  options: ICompilerOptions
): TagFn<Promise<string>> {
  return function tag(strings: string[], ...values: any): Promise<string> {
    return asyncRender({ strings, values }, scope, options)
  }
}

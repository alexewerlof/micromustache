import { ICompilerOptions, compile } from './compile'
import { Scope } from './get'
import { Template, TagFn } from './tokenize'
import { ResolveFn } from './resolver'

/**
 * Replaces every {{variable}} inside the template with values provided by scope.
 *
 * @param template - The template containing one or more {{variableNames}} every variable
 * names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param scope - An object containing values for every variable names that is used in the template.
 * If it's omitted, it'll be set to an empty object essentially removing all {{varName}}s from the template.
 * @param options - compiler options
 * @returns - Template where its variable names replaced with corresponding values.
 * If a value is not found or is invalid, it will be assumed empty string ''.
 * If the value is an object itself, it'll be stringified by JSON.
 * In case of a JSON stringify error the result will look like "{...}".
 */
export function render(
  template: Template,
  scope?: Scope,
  options?: ICompilerOptions,
  resolveFn?: ResolveFn
): string {
  return compile(template, options).render(scope, resolveFn)
}

export async function asyncRender(
  template: Template,
  scope?: Scope,
  options?: ICompilerOptions,
  resolveFn?: ResolveFn
): Promise<string> {
  return compile(template, options).renderAsync(scope, resolveFn)
}

export function renderTag(
  scope: Scope,
  options: ICompilerOptions,
  resolveFn?: ResolveFn
): TagFn<string> {
  return function tag(strings: string[], ...values: any): string {
    return render({ strings, values }, scope, options, resolveFn)
  }
}

export function asyncRenderTag(
  scope: Scope,
  options: ICompilerOptions,
  resolveFn?: ResolveFn
): TagFn<Promise<string>> {
  return function tag(strings: string[], ...values: any): Promise<string> {
    return asyncRender({ strings, values }, scope, options, resolveFn)
  }
}

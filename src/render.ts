import { compile, compileAsync } from './compile'
import { ICompilerOptions, Scope, AsyncRenderer, Renderer } from './types'

/**
 * Replaces every {{variable}} inside the template with values provided by scope.
 *
 * @param template The template containing one or more {{variableNames}} every variable
 * names that is used in the template. If it's omitted, it'll be assumed an empty object.
 * @param scope An object containing values for every variable names that is used in the template.
 * If it's omitted, it'll be set to an empty object essentially removing all {{varName}}s from the template.
 * @param options compiler options
 * @returns Template where its variable names replaced with corresponding values.
 * If a value is not found or is invalid, it will be assumed empty string ''.
 * If the value is an object itself, it'll be stringified by JSON.
 * In case of a JSON stringify error the result will look like "{...}".
 */
export function render(
  template: string,
  scope: Scope = {},
  options?: ICompilerOptions
): string {
  const renderer: Renderer = compile(template, options)
  return renderer(scope)
}

export async function renderAsync(
  template: string,
  scope: Scope = {},
  options?: ICompilerOptions
): Promise<string> {
  const renderer: AsyncRenderer = compileAsync(template, options)
  return renderer(scope)
}

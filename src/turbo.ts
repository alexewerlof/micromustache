import { Scope, getKeys } from './get'
import { ResolveFn } from './resolver'
import { assertTruthy } from './util'
import { isString } from 'util'
import { Cache } from './cache'

const cache = new Cache(1000)

function toPath(path: string): string[] {
  return path.split('.').map(p => p.trim())
}

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
export function turboRender(template: string, scope: Scope = {}): string {
  // assertTruthy(isString(template), `Template must be a string. Got ${template}`)

  return template.replace(/\{\{\s*(\S+)\s*\}\}/g, (match, path: string) => {
    const pathArr = cache.getItem(toPath, path)
    let currentScope = scope
    for (const key of pathArr) {
      // @ts-ignore
      currentScope = currentScope[key]
    }
    return String(currentScope)
  })
}

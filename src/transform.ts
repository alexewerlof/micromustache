import { ParsedTemplate, isParsedTemplate } from './parse'

export function transform<T, R>(
  parsedTemplate: ParsedTemplate<T>,
  transformer: (value: T, index: number, array: T[]) => R
): ParsedTemplate<R> {
  if (!isParsedTemplate(parsedTemplate)) {
    throw new TypeError(`Invalid parsed template: ${parsedTemplate}`)
  }

  const { strings, vars } = parsedTemplate

  const transformedVars = vars.map(transformer)

  return { strings, vars: transformedVars }
}

export async function transformAsync<T, R>(
  parsedTemplate: ParsedTemplate<T>,
  transformer: (value: T, index: number, array: T[]) => Promise<R>
): Promise<ParsedTemplate<R>> {
  const { strings, vars } = transform(parsedTemplate, transformer)
  return { strings, vars: await Promise.all(vars) }
}

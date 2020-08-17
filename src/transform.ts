import { ParsedTemplate, isParsedTemplate } from './parse'

export function transform<T, R>(
  parsedTemplate: ParsedTemplate<T>,
  transformer: (value: T, index: number, array: T[]) => R
): ParsedTemplate<R> {
  if (!isParsedTemplate(parsedTemplate)) {
    throw new TypeError(`Invalid parsed template: ${parsedTemplate}`)
  }

  const { strings, subs } = parsedTemplate

  const transformedSubs = subs.map(transformer)

  return { strings, subs: transformedSubs }
}

export async function transformAsync<T, R>(
  parsedTemplate: ParsedTemplate<T>,
  transformer: (value: T, index: number, array: T[]) => Promise<R>
): Promise<ParsedTemplate<R>> {
  const { strings, subs } = transform(parsedTemplate, transformer)
  return { strings, subs: await Promise.all(subs) }
}

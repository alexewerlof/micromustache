import { assertTruthy, isObject } from './util'
import { ITokenizeOptions } from './types'

export function toTemplate(strings: string[], ...values: any) {
  return toTemplateOpt()(strings, ...values)
}

// TODO add types
export function toTemplateOpt(options: ITokenizeOptions = {}) {
  assertTruthy(
    isObject(options),
    `When a options are provided, it should be an object. Got ${options}`,
    TypeError
  )
  const { openSymbol = '{{', closeSymbol = '}}' } = options

  return function convertToTemplate(strings: string[], ...values: any) {
    let ret = ''
    const lastStringIndex = strings.length - 1
    for (let i = 0; i < lastStringIndex; i++) {
      ret += strings[i] + openSymbol + values[i] + closeSymbol
    }

    return ret + strings[lastStringIndex]
  }
}

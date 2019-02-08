import { guessCloseSymbol } from './util'

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

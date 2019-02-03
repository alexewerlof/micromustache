import { assertTruthy } from './util';
import { toPath } from './topath';
import { IToken, ITokenizeOptions, TokenType } from './types';

export class Token implements IToken {
  private pathsCache: string[]

  constructor(public varName: string) {}

  get paths() {
    if (!this.pathsCache) {
      this.pathsCache = toPath(this.varName as string)
    }
    return this.pathsCache
  }
}

/**
 * Tokenize the template string and return an array of strings and
 * functions ready for the compiler to go through them.
 * This function could use regular expressions but using simpler searches is faster.
 *
 * @param template - the template
 * @param options - the options form compile()
 * @returns the resulting string
 */
export function tokenize(template: string, { openSymbol = '{{', closeSymbol = '}}' }: ITokenizeOptions = {}): TokenType[] {
  assertTruthy(openSymbol !== closeSymbol, `Open and close symbol can't be the same ${openSymbol}`);
  const openSymbolLength = openSymbol.length
  const closeSymbolLength = closeSymbol.length
  let openIndex: number = -1;
  let closeIndex: number = -1;
  let before: string;
  let varName: string;
  const ret: TokenType[] = []
  let currentIndex = -openSymbolLength;
  let someOpenSymbolFound = false;
  while (currentIndex < template.length) {
    openIndex = template.indexOf(openSymbol, currentIndex)
    if (openIndex === -1) {
      break;
    }
    someOpenSymbolFound = true
    closeIndex = template.indexOf(closeSymbol, openIndex)
    if (closeIndex === -1) {
      throw new SyntaxError(`An ${openSymbol} found without ${closeSymbol} in ${template}`)
    }
    varName = template.substring(openIndex + openSymbolLength, closeIndex).trim()
    if (varName.indexOf(openSymbol) !== -1 || varName.indexOf(closeSymbol) !== -1) {
      throw new SyntaxError(`Invalid variable name ${varName} in ${template}`)
    }
    closeIndex += closeSymbolLength
    before = template.substring(currentIndex, openIndex)
    currentIndex = closeIndex

    if (before !== '') {
      if (before.indexOf(openSymbol) !== -1 || before.indexOf(closeSymbol) !== -1) {
        throw new SyntaxError(`Invalid open and close match at ${before} in ${template}`)
      }
      ret.push(before)
    }
    if (varName !== '') {
      ret.push(new Token(varName))
    }
  }
  if (closeIndex !== template.length) {
    const rest = template.substring(closeIndex)
    if (rest.indexOf(closeSymbol) !== -1) {
      throw new SyntaxError(`A closing symbol found without an opening at ${rest} in ${template}`)
    }
    ret.push(rest)
  }
  return ret
}

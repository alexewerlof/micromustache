import { compile, ParsedTokens } from './compile'

describe('compile()', () => {
  it('returns ParsedTokens', () => {
    const compiledTokens: ParsedTokens = compile('Hello {{name}}!')
    expect(compiledTokens).toEqual({
      strings: ['Hello ', '!'],
      refs: [['name']],
    })
  })
})

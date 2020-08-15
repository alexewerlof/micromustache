import { compile, TokenizedTemplate } from './compile'

describe('compile()', () => {
  it('returns TokenizedTemplate', () => {
    const compiledTokens: TokenizedTemplate = compile('Hello {{name}}!')
    expect(compiledTokens).toEqual({
      strings: ['Hello ', '!'],
      refs: [['name']],
    })
  })
})

import { compile } from './compile'

describe('compile()', () => {
  it('returns Parsed', () => {
    const compiledTokens = compile('Hello {{name}}!')
    expect(compiledTokens).toEqual({
      strings: ['Hello ', '!'],
      vars: [['name']],
    })
  })
})

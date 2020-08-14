import { tokenize } from './tokenize'

describe('tokenize()', () => {
  it('returns the string intact if no interpolation is found', () => {
    expect(tokenize('Hello world')).toEqual({
      strings: ['Hello world'],
      refs: [],
    })
  })

  it('supports customized tags', () => {
    expect(tokenize('Hello {name}!', { tags: ['{', '}'] })).toEqual({
      strings: ['Hello ', '!'],
      refs: ['name'],
    })
  })

  it('throws if the open and close tag are the same', () => {
    expect(() => tokenize('Hello |name|!', { tags: ['|', '|'] })).toThrow(TypeError)
  })

  it('throws if the open tag contains the close tag', () => {
    expect(() => tokenize('Hello {{name}!', { tags: ['{{', '{'] })).toThrow(Error)
  })

  it('throws if the open and close tag are the same', () => {
    expect(() => tokenize('Hello {name}}!', { tags: ['}', '}}'] })).toThrow(Error)
  })

  it('returns an empty string and no refs when the template is an empty string', () => {
    expect(tokenize('')).toEqual({
      strings: [''],
      refs: [],
    })
  })

  it('handles interpolation correctly at the start of the template', () => {
    expect(tokenize('{{name}}! How are you?')).toEqual({
      strings: ['', '! How are you?'],
      refs: ['name'],
    })
  })

  it('handles interpolation correctly at the end of the template', () => {
    expect(tokenize('My name is {{name}}')).toEqual({
      strings: ['My name is ', ''],
      refs: ['name'],
    })
  })

  it('trims value name', () => {
    const { refs } = tokenize('My name is {{  name  }}')
    if (refs.length) {
      expect(refs[0]).toBe('name')
    }
  })

  it('can handle a close symbol without an open symbol', () => {
    expect(tokenize('Hi}} {{name}}')).toEqual({
      strings: ['Hi}} ', ''],
      refs: ['name'],
    })
    expect(tokenize('Hi {{name}} }}')).toEqual({
      strings: ['Hi ', ' }}'],
      refs: ['name'],
    })
  })

  it('throws a syntax error if the open symbol is not closed', () => {
    expect(() => tokenize('Hi {{')).toThrow(
      new SyntaxError(
        'Missing "}}" in the template for the "{{" at position 3 within 1000 characters'
      )
    )
  })

  it('does not throw an error if there is a close symbol without an open symbol', () => {
    expect(() => tokenize('Hi}} ')).not.toThrow()
  })

  it('throws a syntax error if the ref is an empty string', () => {
    expect(() => tokenize('Hi {{}}')).toThrow(
      new SyntaxError('Unexpected "}}" tag found at position 3')
    )
  })

  it('throws a syntax error if the value name is just spaces', () => {
    expect(() => tokenize('Hi {{ }}')).toThrow(
      new SyntaxError('Unexpected "}}" tag found at position 3')
    )
  })

  it('throws for nested open and close symbol', () => {
    expect(() => tokenize('Hello {{ {{name}} }}!')).toThrow()
  })

  it('throws if the ref is too long', () => {
    expect(() => tokenize('Hej {{n2345}}!', { maxRefLen: 5 })).not.toThrow()
    expect(() => tokenize('Hej {{n2345}}!', { maxRefLen: 4 })).toThrow()
  })
})

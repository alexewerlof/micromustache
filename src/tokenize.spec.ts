import { tokenize } from './tokenize'

describe('tokenize()', () => {
  it('returns the string intact if no interpolation is found', () => {
    expect(tokenize('Hello world')).toEqual({
      strings: ['Hello world'],
      varNames: [],
    })
  })

  it('supports customized tags', () => {
    expect(tokenize('Hello {name}!', { tags: ['{', '}'] })).toEqual({
      strings: ['Hello ', '!'],
      varNames: ['name'],
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

  it('returns an empty string and no varNames when the template is an empty string', () => {
    expect(tokenize('')).toEqual({
      strings: [''],
      varNames: [],
    })
  })

  it('handles interpolation correctly at the start of the template', () => {
    expect(tokenize('{{name}}! How are you?')).toEqual({
      strings: ['', '! How are you?'],
      varNames: ['name'],
    })
  })

  it('handles interpolation correctly at the end of the template', () => {
    expect(tokenize('My name is {{name}}')).toEqual({
      strings: ['My name is ', ''],
      varNames: ['name'],
    })
  })

  it('trims value name', () => {
    const { varNames } = tokenize('My name is {{  name  }}')
    if (varNames.length) {
      expect(varNames[0]).toBe('name')
    }
  })

  it('can handle a close symbol without an open symbol', () => {
    expect(tokenize('Hi}} {{name}}')).toEqual({
      strings: ['Hi}} ', ''],
      varNames: ['name'],
    })
    expect(tokenize('Hi {{name}} }}')).toEqual({
      strings: ['Hi ', ' }}'],
      varNames: ['name'],
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

  it('throws a syntax error if the variable name is an empty string', () => {
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

  it('throws if the variable name is too long', () => {
    expect(() => tokenize('Hej {{n2345}}!', { maxVarNameLength: 5 })).not.toThrow()
    expect(() => tokenize('Hej {{n2345}}!', { maxVarNameLength: 4 })).toThrow()
  })
})

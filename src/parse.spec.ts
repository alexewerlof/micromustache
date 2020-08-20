import { parse } from './parse'

describe('parse()', () => {
  it('returns the string intact if no interpolation is found', () => {
    expect(parse('Hello world')).toEqual({
      strings: ['Hello world'],
      subs: [],
    })
  })

  it('supports customized tags', () => {
    expect(parse('Hello {name}!', { tags: ['{', '}'] })).toEqual({
      strings: ['Hello ', '!'],
      subs: ['name'],
    })
  })

  it('throws if the open and close tag are the same', () => {
    expect(() => parse('Hello |name|!', { tags: ['|', '|'] })).toThrow(TypeError)
  })

  it('throws if the open tag contains the close tag', () => {
    expect(() => parse('Hello {{name}!', { tags: ['{{', '{'] })).toThrow(Error)
  })

  it('throws if the open and close tag are the same', () => {
    expect(() => parse('Hello {name}}!', { tags: ['}', '}}'] })).toThrow(Error)
  })

  it('returns an empty string and no paths when the template is an empty string', () => {
    expect(parse('')).toEqual({
      strings: [''],
      subs: [],
    })
  })

  it('handles interpolation correctly at the start of the template', () => {
    expect(parse('{{name}}! How are you?')).toEqual({
      strings: ['', '! How are you?'],
      subs: ['name'],
    })
  })

  it('handles interpolation correctly at the end of the template', () => {
    expect(parse('My name is {{name}}')).toEqual({
      strings: ['My name is ', ''],
      subs: ['name'],
    })
  })

  it('trims path', () => {
    const { subs } = parse('My name is {{  name  }}')
    if (subs.length) {
      expect(subs[0]).toBe('name')
    }
  })

  it('can handle a close tag without an open tag', () => {
    expect(parse('Hi}} {{name}}')).toEqual({
      strings: ['Hi}} ', ''],
      subs: ['name'],
    })
    expect(parse('Hi {{name}} }}')).toEqual({
      strings: ['Hi ', ' }}'],
      subs: ['name'],
    })
  })

  it('throws a syntax error if the open tag is not closed', () => {
    expect(() => parse('Hi {{')).toThrow(
      new SyntaxError('parse() cannot find "}}" for the "{{" at position 3 within 1000 characters')
    )
  })

  it('does not throw an error if there is a close tag without an open tag', () => {
    expect(() => parse('Hi}} ')).not.toThrow()
  })

  it('throws a syntax error if the path is an empty string', () => {
    expect(() => parse('Hi {{}}')).toThrow(
      new SyntaxError('parse() found an unexpected "}}" at position 3')
    )
  })

  it('throws a syntax error if the value name is just spaces', () => {
    expect(() => parse('Hi {{ }}')).toThrow(
      new SyntaxError('parse() found an unexpected "}}" at position 3')
    )
  })

  it('throws for nested open and close tag', () => {
    expect(() => parse('Hello {{ {{name}} }}!')).toThrow()
  })

  it('throws if the path is too long', () => {
    expect(() => parse('Hej {{n2345}}!', { maxPathLen: 5 })).not.toThrow()
    expect(() => parse('Hej {{n2345}}!', { maxPathLen: 4 })).toThrow()
  })
})

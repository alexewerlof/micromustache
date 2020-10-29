import { parse } from './parse'

describe('parse()', () => {
  it('returns the string intact if no interpolation is found', () => {
    expect(parse('Hello world')).toEqual({
      strings: ['Hello world'],
      subs: [],
    })
  })

  it('throws if the template is too big', () => {
    expect(() => parse('123456', { maxTemplateLen: 5 })).toThrow(RangeError)
    expect(() => parse('123456', { maxTemplateLen: 6 })).not.toThrow()
  })

  it('throws if there are too many paths', () => {
    expect(() => parse('Hi {{name}}! How is {{planet}}?', { maxPathCount: 1 })).toThrow(RangeError)
    expect(() => parse('Hi {{name}}! How is {{planet}}?', { maxPathCount: 2 })).not.toThrow()
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

  it('does not trim the path', () => {
    const { subs } = parse('My name is {{  name  }}')
    if (subs.length) {
      expect(subs[0]).toBe('  name  ')
    }
  })

  it('throws a syntax error if the open tag is not closed', () => {
    expect(() => parse('Hi {{')).toThrow(
      new SyntaxError('parse() cannot find }} matching the {{ at position 3')
    )
  })

  it('throws if there is a dangling close tag', () => {
    expect(() => parse('Molly }} Bark')).toThrow(SyntaxError)
    expect(() => parse('Molly }}')).toThrow(SyntaxError)
    expect(() => parse('}}')).toThrow(SyntaxError)
    expect(() => parse('}} Bark')).toThrow(SyntaxError)
    expect(() => parse('Molly {{}} }} Bark')).toThrow(SyntaxError)
    expect(() => parse('Molly }}{{}} Bark')).toThrow(SyntaxError)
    expect(() => parse('Molly {{}} the }} Bark')).toThrow(SyntaxError)
  })

  it('supports empty paths', () => {
    expect(parse('Hi {{}}')).toEqual({
      strings: ['Hi ', ''],
      subs: [''],
    })

    expect(parse('Hi {{ }}')).toEqual({
      strings: ['Hi ', ''],
      subs: [' '],
    })
  })

  it('throws for nested open and close tag', () => {
    expect(() => parse('Hello {{ {{name}} }}!')).toThrow()
  })

  it('throws if the path is too long', () => {
    expect(() => parse('Hej {{n2345}}!', { maxPathLen: 5 })).not.toThrow()
    expect(() => parse('Hej {{n2345}}!', { maxPathLen: 4 })).toThrow()
  })
})

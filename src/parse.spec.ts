import { parseTemplate } from './parse'

describe('parseTemplate()', () => {
  it('returns the string intact if no interpolation is found', () => {
    expect(parseTemplate('Hello world')).toEqual({
      strings: ['Hello world'],
      paths: [],
    })
  })

  it('supports customized tags', () => {
    expect(parseTemplate('Hello {name}!', { tags: ['{', '}'] })).toEqual({
      strings: ['Hello ', '!'],
      paths: ['name'],
    })
  })

  it('throws if the open and close tag are the same', () => {
    expect(() => parseTemplate('Hello |name|!', { tags: ['|', '|'] })).toThrow(TypeError)
  })

  it('throws if the open tag contains the close tag', () => {
    expect(() => parseTemplate('Hello {{name}!', { tags: ['{{', '{'] })).toThrow(Error)
  })

  it('throws if the open and close tag are the same', () => {
    expect(() => parseTemplate('Hello {name}}!', { tags: ['}', '}}'] })).toThrow(Error)
  })

  it('returns an empty string and no paths when the template is an empty string', () => {
    expect(parseTemplate('')).toEqual({
      strings: [''],
      paths: [],
    })
  })

  it('handles interpolation correctly at the start of the template', () => {
    expect(parseTemplate('{{name}}! How are you?')).toEqual({
      strings: ['', '! How are you?'],
      paths: ['name'],
    })
  })

  it('handles interpolation correctly at the end of the template', () => {
    expect(parseTemplate('My name is {{name}}')).toEqual({
      strings: ['My name is ', ''],
      paths: ['name'],
    })
  })

  it('trims path', () => {
    const { paths } = parseTemplate('My name is {{  name  }}')
    if (paths.length) {
      expect(paths[0]).toBe('name')
    }
  })

  it('can handle a close tag without an open tag', () => {
    expect(parseTemplate('Hi}} {{name}}')).toEqual({
      strings: ['Hi}} ', ''],
      paths: ['name'],
    })
    expect(parseTemplate('Hi {{name}} }}')).toEqual({
      strings: ['Hi ', ' }}'],
      paths: ['name'],
    })
  })

  it('throws a syntax error if the open tag is not closed', () => {
    expect(() => parseTemplate('Hi {{')).toThrow(
      new SyntaxError(
        'Missing "}}" in the template for the "{{" at position 3 within 1000 characters'
      )
    )
  })

  it('does not throw an error if there is a close tag without an open tag', () => {
    expect(() => parseTemplate('Hi}} ')).not.toThrow()
  })

  it('throws a syntax error if the path is an empty string', () => {
    expect(() => parseTemplate('Hi {{}}')).toThrow(
      new SyntaxError('Unexpected "}}" tag found at position 3')
    )
  })

  it('throws a syntax error if the value name is just spaces', () => {
    expect(() => parseTemplate('Hi {{ }}')).toThrow(
      new SyntaxError('Unexpected "}}" tag found at position 3')
    )
  })

  it('throws for nested open and close tag', () => {
    expect(() => parseTemplate('Hello {{ {{name}} }}!')).toThrow()
  })

  it('throws if the path is too long', () => {
    expect(() => parseTemplate('Hej {{n2345}}!', { maxPathLen: 5 })).not.toThrow()
    expect(() => parseTemplate('Hej {{n2345}}!', { maxPathLen: 4 })).toThrow()
  })
})

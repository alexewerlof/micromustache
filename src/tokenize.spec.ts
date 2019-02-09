import { describe } from 'mocha'
import { parseString, NameToken, tokenize } from './tokenize'
import { expect } from 'chai'

describe('parseString()', () => {
  it('supports custom close and open symbols', () => {
    const options = {
      openSymbol: '${',
      closeSymbol: '}'
    }
    // tslint:disable-next-line no-invalid-template-strings
    expect(parseString('hello ${name}!', options)).to.deep.equal({
      strings: ['hello ', '!'],
      values: ['name']
    })
  })

  it('returns the string if no interpolation is found', () => {
    expect(parseString('Hello world')).to.deep.equal({
      strings: ['Hello world'],
      values: []
    })
  })

  it('returns an empty string and no values when the template is an empty string', () => {
    expect(parseString('')).to.deep.equal({
      strings: [''],
      values: []
    })
  })

  it('handles interpolation correctly at the start of the template', () => {
    expect(parseString('{{name}}! How are you?')).to.deep.equal({
      strings: ['', '! How are you?'],
      values: ['name']
    })
  })

  it('handles interpolation correctly at the end of the template', () => {
    expect(parseString('My name is {{name}}')).to.deep.equal({
      strings: ['My name is ', ''],
      values: ['name']
    })
  })

  it('trims value name', () => {
    const { values } = parseString('My name is {{  name  }}')
    if (values.length) {
      expect(values[0]).to.equal('name')
    }
  })

  it('can handle a close symbol without an open symbol', () => {
    expect(parseString('Hi}} {{name}}')).to.deep.equal({
      strings: ['Hi}} ', ''],
      values: ['name']
    })
    expect(parseString('Hi {{name}} }}')).to.deep.equal({
      strings: ['Hi ', ' }}'],
      values: ['name']
    })
  })

  it('throws a syntax error if the open symbol is not closed', () => {
    expect(() => parseString('Hi {{')).to.throw(
      SyntaxError,
      'Missing }} in template expression'
    )
  })

  it('does not throw an error if there is a close symbol without an open symbol', () => {
    expect(() => parseString('Hi}} ')).not.to.throw()
  })

  it('throws a syntax error if the variable name is an empty string', () => {
    expect(() => parseString('Hi {{}}')).to.throw(
      SyntaxError,
      'Unexpected token }}'
    )
  })

  it('throws a syntax error if the value name is just spaces', () => {
    expect(() => parseString('Hi {{ }}')).to.throw(
      SyntaxError,
      'Unexpected token }}'
    )
  })

  it('throws for nested open and close symbol', () => {
    expect(() => parseString('Hello {{ {{name}} }}!')).to.throw()
  })

  it('throws if open and close symbol are the same', () => {
    const options = {
      openSymbol: '{{',
      closeSymbol: '{{'
    }
    // tslint:disable-next-line no-invalid-template-strings
    expect(() => parseString('hello!', options)).to.throw(Error)
  })
})

describe('tokenize()', () => {
  it('parses and tokenizes a string', () => {
    const input = 'Hi! My name is {{Alex}}.'
    expect(tokenize(input)).to.deep.equal({
      strings: ['Hi! My name is ', '.'],
      values: [new NameToken('Alex')]
    })
  })

  it('converts values to NameToken objects', () => {
    const input = {
      strings: ['Hi! My name is ', '.'],
      values: ['Alex']
    }
    expect(tokenize(input)).to.deep.equal({
      strings: ['Hi! My name is ', '.'],
      values: [new NameToken('Alex')]
    })
  })

  it('does not touch the string array', () => {
    const input = {
      strings: ['Hi! My name is ', '.'],
      values: []
    }
    expect(tokenize(input).strings).to.equal(input.strings)
  })
})

import { describe } from 'mocha'
import { tokenize } from './tokenize'
import { expect } from 'chai'

describe('tokenize()', () => {
  it('supports custom close and open symbols', () => {
    const options = {
      openSymbol: '${',
      closeSymbol: '}'
    }
    // tslint:disable-next-line no-invalid-template-strings
    expect(tokenize('hello ${name}!', options)).to.deep.equal({
      strings: ['hello ', '!'],
      values: ['name']
    })
  })

  it('returns the string if no interpolation is found', () => {
    expect(tokenize('Hello world')).to.deep.equal({
      strings: ['Hello world'],
      values: []
    })
  })

  it('returns an empty string and no values when the template is an empty string', () => {
    expect(tokenize('')).to.deep.equal({
      strings: [''],
      values: []
    })
  })

  it('handles interpolation correctly at the start of the template', () => {
    expect(tokenize('{{name}}! How are you?')).to.deep.equal({
      strings: ['', '! How are you?'],
      values: ['name']
    })
  })

  it('handles interpolation correctly at the end of the template', () => {
    expect(tokenize('My name is {{name}}')).to.deep.equal({
      strings: ['My name is ', ''],
      values: ['name']
    })
  })

  it('trims value name', () => {
    const { values } = tokenize('My name is {{  name  }}')
    if (values.length) {
      expect(values[0]).to.equal('name')
    }
  })

  it('can handle a close symbol without an open symbol', () => {
    expect(tokenize('Hi}} {{name}}')).to.deep.equal({
      strings: ['Hi}} ', ''],
      values: ['name']
    })
    expect(tokenize('Hi {{name}} }}')).to.deep.equal({
      strings: ['Hi ', ' }}'],
      values: ['name']
    })
  })

  it('throws a syntax error if the open symbol is not closed', () => {
    expect(() => tokenize('Hi {{')).to.throw(
      SyntaxError,
      'Missing }} in template expression'
    )
  })

  it('does not throw an error if there is a close symbol without an open symbol', () => {
    expect(() => tokenize('Hi}} ')).not.to.throw()
  })

  it('throws a syntax error if the variable name is an empty string', () => {
    expect(() => tokenize('Hi {{}}')).to.throw(
      SyntaxError,
      'Unexpected token }}'
    )
  })

  it('throws a syntax error if the value name is just spaces', () => {
    expect(() => tokenize('Hi {{ }}')).to.throw(
      SyntaxError,
      'Unexpected token }}'
    )
  })

  it('throws for nested open and close symbol', () => {
    expect(() => tokenize('Hello {{ {{name}} }}!')).to.throw()
  })

  it('throws if open and close symbol are the same', () => {
    const options = {
      openSymbol: '{{',
      closeSymbol: '{{'
    }
    // tslint:disable-next-line no-invalid-template-strings
    expect(() => tokenize('hello!', options)).to.throw(Error)
  })
})

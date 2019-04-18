import { describe } from 'mocha'
import { tokenize } from './tokenize'
import { expect } from 'chai'

describe('tokenize()', () => {
  it('returns the string intact if no interpolation is found', () => {
    expect(tokenize('Hello world')).to.deep.equal({
      strings: ['Hello world'],
      varNames: []
    })
  })

  it('supports customized tags', () => {
    expect(tokenize('Hello {name}!', ['{', '}'])).to.deep.equal({
      strings: ['Hello ', '!'],
      varNames: ['name']
    })
  })

  it('throws if the open and close tag are the same', () => {
    expect(() => tokenize('Hello |name|!', ['|', '|'])).to.throw(TypeError)
  })

  it('returns an empty string and no varNames when the template is an empty string', () => {
    expect(tokenize('')).to.deep.equal({
      strings: [''],
      varNames: []
    })
  })

  it('handles interpolation correctly at the start of the template', () => {
    expect(tokenize('{{name}}! How are you?')).to.deep.equal({
      strings: ['', '! How are you?'],
      varNames: ['name']
    })
  })

  it('handles interpolation correctly at the end of the template', () => {
    expect(tokenize('My name is {{name}}')).to.deep.equal({
      strings: ['My name is ', ''],
      varNames: ['name']
    })
  })

  it('trims value name', () => {
    const { varNames } = tokenize('My name is {{  name  }}')
    if (varNames.length) {
      expect(varNames[0]).to.equal('name')
    }
  })

  it('can handle a close symbol without an open symbol', () => {
    expect(tokenize('Hi}} {{name}}')).to.deep.equal({
      strings: ['Hi}} ', ''],
      varNames: ['name']
    })
    expect(tokenize('Hi {{name}} }}')).to.deep.equal({
      strings: ['Hi ', ' }}'],
      varNames: ['name']
    })
  })

  it('throws a syntax error if the open symbol is not closed', () => {
    expect(() => tokenize('Hi {{')).to.throw(
      SyntaxError,
      'Missing }} in the template expression Hi {{'
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
})

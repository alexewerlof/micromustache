import { describe } from "mocha";
import { tokenize, Token } from "./tokenize";
import { expect } from 'chai';

describe('tokenize()', () => {
  it('can tokenize a simple template', () => {
    expect(tokenize('hello')).to.deep.equal(['hello'])
  });

  it('can tokenize a template with interpolation signs', () => {
    expect(tokenize('hello {{name}}!')).to.deep.equal([
      'hello ',
      new Token('name'),
      '!'
    ])
  });

  it('trims the variable name', () => {
    expect(tokenize('hello {{  name  }}!')).to.deep.equal([
      'hello ',
      new Token('name'),
      '!'
    ])
  });

  it('does not make unnecessary tokens if the variable name is empty', () => {
    expect(tokenize('hello {{    }}!')).to.deep.equal([
      'hello ',
      '!'
    ])

    expect(tokenize('hello {{}}!')).to.deep.equal([
      'hello ',
      '!'
    ])
  });

  it('does not return unnecessary strings when they are empty', () => {
    expect(tokenize('{{variable name}}')).to.deep.equal([
      new Token('variable name')
    ])
  })

  it('can tokenize a template with interpolation at the start', () => {
    expect(tokenize('{{name}} said hello!')).to.deep.equal([
      new Token('name'),
      ' said hello!'
    ])
  });

  it('can tokenize a template with interpolation at the end', () => {
    expect(tokenize('Hello! My name is {{name}}.')).to.deep.equal([
      'Hello! My name is ',
      new Token('name'),
      '.'
    ])
  });

  it('throws an error for when the interpolation start has no end', () => {
    expect(() => tokenize('Hello {{and')).to.throw()
  });

  it('throws an error for when the interpolation ends with no start', () => {
    expect(() => tokenize('Hello {{name}} and}}')).to.throw()
    expect(() => tokenize('Hello and}}')).to.throw()
  });

  it('throws an error for misplaced open and close symbol', () => {
    expect(() => tokenize('Hello }}name{{!')).to.throw()
  });

  it('throws for nested open and close symbol', () => {
    expect(() => tokenize('Hello {{ {{name}} }}!')).to.throw()
  });

  it('supports custom close and open symbols', () => {
    const options = {
      openSymbol: '${',
      closeSymbol: '}'
    }
    // tslint:disable-next-line no-invalid-template-strings
    expect(tokenize('hello ${name}!', options)).to.deep.equal([
      'hello ',
      new Token('name'),
      '!'
    ])
  })

  it('throws if open and close symbol are the same', () => {
    const options = {
      openSymbol: '{{',
      closeSymbol: '{{'
    }
    // tslint:disable-next-line no-invalid-template-strings
    expect(() => tokenize('hello!', options)).to.throw()
  })
});

// @ts-ignore
import { expect } from 'chai';
import { toPath } from './topath';

interface SuccessCases {
  [input: string]: string[];
}

function stringArrToString(arr: string[]) {
  return '[' + arr.map(s => `'${s}'`).join(', ') + ']';
}

describe('toPath()', () => {
  describe('success cases:', () => {
    // input: expected output
    const testCases: SuccessCases = {
      'a': ['a'],
      ' a': ['a'],
      '  a': ['a'],
      'a ': ['a'],
      'a  ': ['a'],
      ' a ': ['a'],
      '  a  ': ['a'],
      'a.b': ['a', 'b'],
      'person.name': ['person', 'name'],
      'a. b ': ['a', 'b'],
      'a . b ': ['a', 'b'],
      ' a . b ': ['a', 'b'],
      'a. b': ['a', 'b'],
      'a.b ': ['a', 'b'],
      'a.b.c': ['a', 'b', 'c'],
      'a["b"]': ['a', 'b'],
      'a[\'b\']': ['a', 'b'],
      'a[ \'b\' ]': ['a', 'b'],
      'a["b"].c': ['a', 'b', 'c'],
      'a[ "b" ].c': ['a', 'b', 'c'],
      'a [ "b" ] .c': ['a', 'b', 'c'],
      'a._.c': ['a', '_', 'c'],
      'a.$.c': ['a', '$', 'c'],
      '': [],
      ' ': [],
      '["a"]': ['a'],
      '.a': ['a'],
      'a[11]': ['a', '11'],
      '[13]': ['13'],
      '[17].c': ['17', 'c'],
    }

    Object.keys(testCases).forEach((input: string) => {
      const output = testCases[input];
      it(`'${input}'  \t⇨ ${stringArrToString(output)}`, () => {
        expect(toPath(input)).to.deep.equal(output);
      });
    });
  });

  describe('error cases:', () => {
    // all these strings throw a syntax error
    const syntaxErrorsCases = [
      'a.',
      '.["a"]',
      'a[\'b"]',
      'a["b\']',
      'a["b`]',
      'a[11"]',
      'a[`11]',
      'a[ `11 ]',
    ]

    syntaxErrorsCases.forEach((input: string) => {
      it(`throws syntax error for "${input}"`, () => {
        expect(() => toPath(input)).to.throw(SyntaxError);
      });
    });

    it(`throws type error`, () => {
      // @ts-ignore
      expect(() => toPath(undefined), 'for undefined').to.throw(TypeError);
      // @ts-ignore
      expect(() => toPath(13), 'for a number').to.throw(TypeError);
    });
  });
});

import { expect } from 'chai'
import { toPath } from './topath'

interface ISuccessCases {
  [input: string]: string[]
}

function stringArrToString(arr: string[]) {
  return '[' + arr.map(s => `'${s}'`).join(', ') + ']'
}

describe('toPath()', () => {
  describe('success cases:', () => {
    // input: expected output
    const testCases: ISuccessCases = {
      a: ['a'],
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
      'a[" b "]': ['a', ' b '],
      'a[""]': ['a', ''],
      "a['b']": ['a', 'b'],
      "a[ 'b' ]": ['a', 'b'],
      'a["b"].c': ['a', 'b', 'c'],
      'a[ "b" ].c': ['a', 'b', 'c'],
      'a [ "b" ] .c': ['a', 'b', 'c'],
      'a._.c': ['a', '_', 'c'],
      'a.$.c': ['a', '$', 'c'],
      '': [],
      ' ': [],
      '["a"]': ['a'],
      'a.33': ['a', '33'],
      'a[11]': ['a', '11'],
      'a[-11]': ['a', '-11'],
      'a[b]': ['a', 'b'],
      'a[11x]': ['a', '11x'],
      'a[1.1]': ['a', '1.1'],
      'a[+1.1]': ['a', '1.1'],
      'a["b"]["c"]': ['a', 'b', 'c'],
      '["a"]["b"]["c"]': ['a', 'b', 'c'],
      '["a"].b["c"]': ['a', 'b', 'c'],
      'a["b"].c["d"]': ['a', 'b', 'c', 'd'],
      'a["b"].c["d"].e': ['a', 'b', 'c', 'd', 'e'],
      'a["+1.1"]': ['a', '+1.1'],
      '[13]': ['13'],
      '[17].c': ['17', 'c']
    }

    for (const [input, output] of Object.entries(testCases)) {
      it(`'${input}'  ⇨  ${stringArrToString(output)}`, () => {
        expect(toPath(input)).to.deep.equal(output)
      })
    }
  })

  describe('error cases:', () => {
    // all these strings throw a syntax error
    const syntaxErrorsCases = {
      'a.': SyntaxError,
      'a..': SyntaxError,
      'a..b': SyntaxError,
      'a ..b': SyntaxError,
      'a . .b': SyntaxError,
      'a . . b': SyntaxError,
      'a .. b': SyntaxError,
      '..': SyntaxError,
      '. .': SyntaxError,
      ' . . ': SyntaxError,
      ' .. ': SyntaxError,
      ' .. . ': SyntaxError,
      ' ... ': SyntaxError,
      '.a': SyntaxError,
      ' .a': SyntaxError,
      ' . a': SyntaxError,
      '. a': SyntaxError,
      '.["a"]': SyntaxError,
      '.': SyntaxError,
      ' . ': SyntaxError,
      'a["b"]c': SyntaxError,
      'a.["b"]c': SyntaxError,
      'a.["b"]c["d"]': SyntaxError,
      'a["b"]c["d"]': SyntaxError,
      'a["b"].c["d"]e': SyntaxError,
      'a["b"].c.': SyntaxError,
      'a ["b"] c': SyntaxError,
      'a["]': SyntaxError,
      'a.[b]': SyntaxError,
      'a[\'b"]': SyntaxError,
      'a[[': SyntaxError,
      'a["b\']': SyntaxError,
      'a["b`]': SyntaxError,
      'a[11"]': SyntaxError,
      'a[`11]': SyntaxError,
      'a[ `11 ]': SyntaxError,
      // Special cases
      'a["["]': SyntaxError,
      'a[[]]': SyntaxError
    }

    for (const [input, errorConstructor] of Object.entries(syntaxErrorsCases)) {
      it(`throws ${errorConstructor.name} for "${input}"`, () => {
        expect(() => toPath(input)).to.throw(errorConstructor)
      })
    }

    it(`throws type error`, () => {
      // @ts-ignore
      expect(() => toPath(undefined), 'for undefined').to.throw(TypeError)
      // @ts-ignore
      expect(() => toPath(13), 'for a number').to.throw(TypeError)
    })
  })
})

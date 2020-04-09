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
      '[17].c': ['17', 'c'],
      'a["["]': ['a', '[']
    }

    for (const [input, output] of Object.entries(testCases)) {
      it(`'${input}'  ⇨  ${stringArrToString(output)}`, () => {
        expect(toPath(input)).toEqual(output)
      })
    }
  })

  describe('SyntaxError cases:', () => {
    // all these strings throw a syntax error
    const syntaxErrorsCases: string[] = [
      'a.',
      'a..',
      'a..b',
      'a ..b',
      'a . .b',
      'a . . b',
      'a .. b',
      '..',
      '. .',
      ' . . ',
      ' .. ',
      ' .. . ',
      ' ... ',
      '.a',
      ' .a',
      ' . a',
      '. a',
      '.["a"]',
      '.',
      ' . ',
      'a["b"]c',
      'a.["b"]c',
      'a.["b"]c["d"]',
      'a["b"]c["d"]',
      'a["b"].c["d"]e',
      'a["b"].c.',
      'a ["b"] c',
      'a["]',
      'a.[b]',
      'a[\'b"]',
      'a[[',
      'a["b\']',
      'a["b`]',
      'a[11"]',
      'a[`11]',
      'a[ `11 ]',
      // Special cases
      'a["]"]',
      'a[[]]'
    ]

    for (const input of syntaxErrorsCases) {
      it(`throws SyntaxError for "${input}"`, () => {
        expect(() => toPath(input)).toThrow(SyntaxError)
      })
    }

    it('throws type error for invalid input types', () => {
      // @ts-ignore
      expect(() => toPath(undefined)).toThrow(TypeError)
      // @ts-ignore
      expect(() => toPath(13)).toThrow(TypeError)
    })
  })
})

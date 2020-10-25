import { pathToRef, Cache } from './ref'

interface ISuccessCases {
  [input: string]: string[]
}

function stringArrToString(arr: string[]): string {
  return '[' + arr.map((s) => `'${s}'`).join(', ') + ']'
}

describe('pathToRef()', () => {
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
      '.a': ['a'],
      ' .a': ['a'],
      '\n.a': ['a'],
      '\n .a': ['a'],
      ' \n .a': ['a'],
      '.\na': ['a'],
      '.a\n': ['a'],
      ' . a': ['a'],
      '. a': ['a'],
      '_["b"].c': ['_', 'b', 'c'],
      '__["b"].c': ['__', 'b', 'c'],
      '_._b.c': ['_', '_b', 'c'],
      'a.$.c': ['a', '$', 'c'],
      '': [],
      ' ': [],
      '["a"]': ['a'],
      'a.33': ['a', '33'],
      'a[0]': ['a', '0'],
      'a[11]': ['a', '11'],
      'a[+11]': ['a', '11'],
      'a[ +12]': ['a', '12'],
      'a[ + 13]': ['a', '13'],
      'a[+ 14]': ['a', '14'],
      'a["15"]': ['a', '15'],
      'a[ "16"]': ['a', '16'],
      'a["17" ]': ['a', '17'],
      'a["b"]["c"]': ['a', 'b', 'c'],
      '["a"]["b"]["c"]': ['a', 'b', 'c'],
      '["a"].b["c"]': ['a', 'b', 'c'],
      'a["b"].c["d"]': ['a', 'b', 'c', 'd'],
      'a["b"].c["d"].e': ['a', 'b', 'c', 'd', 'e'],
      'a["+1.1"]': ['a', '+1.1'],
      '[13]': ['13'],
      '[17].c': ['17', 'c'],
      'a["["]': ['a', '['],
      'a[ "["]': ['a', '['],
      'a["[" ]': ['a', '['],
      'a["]"]': ['a', ']'],
      'a[ "]"]': ['a', ']'],
      'a["]" ]': ['a', ']'],
      'a[1234567890123456]': ['a', '1234567890123456'],
      'a[0001234567890123456]': ['a', '1234567890123456'],
      'a[001]': ['a', '1'],
    }

    for (const [input, output] of Object.entries(testCases)) {
      it(`'${input}'  ⇨  ${stringArrToString(output)}`, () => {
        expect(pathToRef(input)).toEqual(output)
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
      'a[',
      'a]',
      'a]]',
      'a[[',
      'a["b\']',
      'a["b`]',
      'a[11"]',
      'a[`11]',
      'a[ `11 ]',
      'a[[]]',
      'a[-11]',
      'a[b]',
      'a[11x]',
      'a[1.1]',
      'a[+1.1]',
      'a[-1.1]',
      '.["a"]',
      'name[a].',
      'name,',
      'name;',
      'a[12345678901234567]',
    ]

    for (const input of syntaxErrorsCases) {
      it(`throws SyntaxError for "${input}"`, () => {
        expect(() => pathToRef(input)).toThrow(SyntaxError)
      })
    }

    it('throws type error for invalid input types', () => {
      expect(() => pathToRef((undefined as unknown) as string)).toThrow(TypeError)
      expect(() => pathToRef((13 as unknown) as string)).toThrow(TypeError)
    })
  })
})


describe('Cache', () => {
  it('stores items', () => {
    const c = new Cache<number>(3)
    expect(c.limit).toBe(3)
    c.set('one', 1)
    c.set('two', 2)
    expect(c.size).toBe(2)
  })

  it('removes old items', () => {
    const c = new Cache<string>(3)
    c.set('one', 'ett')
    c.set('two', 'två')
    c.set('three', 'tre')
    expect(c.get('one')).toEqual('ett')
    expect(c.get('two')).toEqual('två')
    expect(c.get('three')).toEqual('tre')
    c.set('four', 'fyra')
    expect(c.get('one')).toEqual(undefined)
    expect(c.get('two')).toEqual('två')
    expect(c.get('three')).toEqual('tre')
    expect(c.get('four')).toEqual('fyra')
    expect(c.limit).toEqual(c.size)
  })
})

import { expect } from 'chai'
import { get, toPath } from './get'

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
      '.a': ['a'],
      ' .a': ['a'],
      ' . a': ['a'],
      '. a': ['a'],
      '.["a"]': ['a'],
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
      'a["]': SyntaxError,
      'a[\'b"]': SyntaxError,
      'a["b\']': SyntaxError,
      'a["b`]': SyntaxError,
      'a[11"]': SyntaxError,
      'a[`11]': SyntaxError,
      'a[ `11 ]': SyntaxError
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

describe('get()', () => {
  it('can resolve 1-level object', () => {
    const obj = {
      foo: 'bar',
      baz: 2
    }
    expect(get(obj, 'foo')).to.equal('bar')
    expect(get(obj, 'baz')).to.equal(2)
  })

  it('can resolve multi-level object', () => {
    const obj = {
      a: {
        b: {
          c: {
            foo: 'bar'
          }
        }
      }
    }
    expect(get(obj, 'a.b.c.foo')).to.equal('bar')
  })

  it('does not throw when the value is supposed to be undefined', () => {
    const obj = {
      foo: 'bar'
    }
    expect(() => get(obj, 'hello')).not.to.throw()
  })

  it('throws if it cannot resolve nested objects', () => {
    const obj = {
      foo: 'bar'
    }
    expect(() => get(obj, 'hello.kitty')).to.throw()
  })

  it('can access array elements', () => {
    const arr = ['banana', 'apple', 'orange', 'pear']
    expect(get(arr, '[1]')).to.equal('apple')
  })

  it('can access a nested array object', () => {
    const obj = {
      arr: ['banana', 'apple', 'orange', 'pear']
    }
    expect(get(obj, 'arr[1]')).to.equal('apple')
  })

  it('supports array syntax', () => {
    const arr = ['banana', 'mandarin', 'orange', 'pear']
    const obj = {
      fruits: ['ananas', 'kiwi']
    }
    expect(get(arr, '[1]')).to.equal('mandarin')
    expect(get(obj, 'fruits[1]')).to.equal('kiwi')
  })

  it('supports array syntax for objects', () => {
    const obj = {
      foo: 'bar',
      baz: {
        a: {
          b: {
            c: [0, 1, 2, 3]
          }
        }
      }
    }

    expect(get(obj, '["foo"]')).to.equal('bar')
    expect(get(obj, `baz["a"]['b'].c[3]`)).to.equal(3)
  })

  it('behaves the same as javascript when accessing keys with spaces around them', () => {
    const obj = {
      foo: 'bar'
    }
    expect(get(obj, ' foo ')).to.equal(obj.foo)
  })

  it('behaves the same as javascript when accessing keys with quotes and spaces around them', () => {
    const obj = {
      foo: {
        bar: 'baz'
      }
    }
    expect(get(obj, 'foo[ "bar" ]')).to.equal(obj.foo.bar)
  })

  it('behaves the same as javascript when accessing array indices with spaces around them', () => {
    const obj = {
      foo: [10, 20, 30]
    }
    expect(get(obj, 'foo[ 1 ]')).to.equal(obj.foo[1])
  })
})

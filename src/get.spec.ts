import { getPath } from './get'

describe('getPath()', () => {
  it('can resolve 1-level deep object', () => {
    const obj = {
      foo: 'bar',
      baz: 2,
    }
    expect(getPath(obj, 'foo')).toBe('bar')
    expect(getPath(obj, 'baz')).toBe(2)
  })

  it('can resolve multi-level object', () => {
    const obj = {
      a: {
        b: {
          c: {
            foo: 'bar',
          },
        },
      },
    }
    expect(getPath(obj, 'a.b.c.foo')).toBe('bar')
  })

  it('does not throw when the value is supposed to be undefined', () => {
    const obj = {
      foo: 'bar',
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => getPath(obj, 'hello')).not.toThrow()
  })

  it('throws if it cannot resolve nested objects', () => {
    const obj = {
      foo: 'bar',
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => getPath(obj, 'cux', { validateRef: true })).toThrow()
  })

  it('throws if the ref is too deep', () => {
    const obj = {
      a: {
        b: {
          c: 37.5,
        },
      },
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => getPath(obj, 'a.b.c', { maxRefDepth: 2 })).toThrow()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => getPath(obj, 'a.b.c', { maxRefDepth: 3 })).not.toThrow()
  })

  it('can access array elements', () => {
    const arr = ['banana', 'apple', 'orange', 'pear']
    expect(getPath(arr, '[1]')).toBe('apple')
  })

  it('can access a nested array object', () => {
    const obj = {
      arr: ['banana', 'apple', 'orange', 'pear'],
    }
    expect(getPath(obj, 'arr[1]')).toBe('apple')
  })

  it('supports array indices', () => {
    const arr = ['banana', 'mandarin', 'orange', 'pear']
    const obj = {
      fruits: ['ananas', 'kiwi'],
    }
    expect(getPath(arr, '[1]')).toBe('mandarin')
    expect(getPath(obj, 'fruits[1]')).toBe('kiwi')
  })

  it('supports array syntax for objects', () => {
    const obj = {
      foo: 'bar',
      baz: {
        a: {
          b: {
            c: [0, 1, 2, 3],
          },
        },
      },
    }

    expect(getPath(obj, '["foo"]')).toBe('bar')
    expect(getPath(obj, `baz["a"]['b'].c[3]`)).toBe(3)
  })

  it('behaves the same as javascript when accessing keys with spaces around them', () => {
    const obj = {
      foo: 'bar',
    }
    expect(getPath(obj, ' foo ')).toBe(obj.foo)
  })

  it('behaves the same as javascript when accessing keys with quotes and spaces around them', () => {
    const obj = {
      foo: {
        bar: 'baz',
      },
    }
    expect(getPath(obj, 'foo[ "bar" ]')).toBe(obj.foo.bar)
  })

  it('behaves the same as javascript when accessing array indices with spaces around them', () => {
    const obj = {
      foo: [10, 20, 30],
    }
    expect(getPath(obj, 'foo[ 1 ]')).toBe(obj.foo[1])
  })

  it('can lookup null from an object', () => {
    const obj = {
      foo: null,
    }
    expect(getPath(obj, 'foo')).toBe(obj.foo)
  })

  it('can lookup undefined from an object', () => {
    const obj = {
      foo: undefined,
    }
    expect(getPath(obj, 'foo')).toBe(obj.foo)
  })

  it('can lookup a key that is literally "null"', () => {
    const obj = {
      null: 'some value for null',
    }
    expect(getPath(obj, 'null')).toBe(obj.null)
  })

  it('can lookup a key that is literally "undefined"', () => {
    const obj = {
      undefined: 'some value for undefined',
    }
    expect(getPath(obj, 'undefined')).toBe(obj.undefined)
  })

  it('supports getts property', () => {
    class A {
      get x(): string {
        return 'the x value'
      }
    }
    const obj = new A()
    expect(getPath(obj, 'x')).toBe('the x value')
  })
})

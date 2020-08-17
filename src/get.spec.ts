import { pathGet } from './get'

describe('pathGet()', () => {
  it('can resolve 1-level deep object', () => {
    const obj = {
      foo: 'bar',
      baz: 2,
    }
    expect(pathGet(obj, 'foo')).toBe('bar')
    expect(pathGet(obj, 'baz')).toBe(2)
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
    expect(pathGet(obj, 'a.b.c.foo')).toBe('bar')
  })

  it('does not throw when the value is supposed to be undefined', () => {
    const obj = {
      foo: 'bar',
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => pathGet(obj, 'hello')).not.toThrow()
  })

  it('throws if it cannot resolve nested objects', () => {
    const obj = {
      foo: 'bar',
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => pathGet(obj, 'cux', { validateRef: true })).toThrow()
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
    expect(() => pathGet(obj, 'a.b.c', { maxRefDepth: 2 })).toThrow()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => pathGet(obj, 'a.b.c', { maxRefDepth: 3 })).not.toThrow()
  })

  it('can access array elements', () => {
    const arr = ['banana', 'apple', 'orange', 'pear']
    expect(pathGet(arr, '[1]')).toBe('apple')
  })

  it('can access a nested array object', () => {
    const obj = {
      arr: ['banana', 'apple', 'orange', 'pear'],
    }
    expect(pathGet(obj, 'arr[1]')).toBe('apple')
  })

  it('supports array indices', () => {
    const arr = ['banana', 'mandarin', 'orange', 'pear']
    const obj = {
      fruits: ['ananas', 'kiwi'],
    }
    expect(pathGet(arr, '[1]')).toBe('mandarin')
    expect(pathGet(obj, 'fruits[1]')).toBe('kiwi')
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

    expect(pathGet(obj, '["foo"]')).toBe('bar')
    expect(pathGet(obj, `baz["a"]['b'].c[3]`)).toBe(3)
  })

  it('behaves the same as javascript when accessing keys with spaces around them', () => {
    const obj = {
      foo: 'bar',
    }
    expect(pathGet(obj, ' foo ')).toBe(obj.foo)
  })

  it('behaves the same as javascript when accessing keys with quotes and spaces around them', () => {
    const obj = {
      foo: {
        bar: 'baz',
      },
    }
    expect(pathGet(obj, 'foo[ "bar" ]')).toBe(obj.foo.bar)
  })

  it('behaves the same as javascript when accessing array indices with spaces around them', () => {
    const obj = {
      foo: [10, 20, 30],
    }
    expect(pathGet(obj, 'foo[ 1 ]')).toBe(obj.foo[1])
  })

  it('can lookup null from an object', () => {
    const obj = {
      foo: null,
    }
    expect(pathGet(obj, 'foo')).toBe(obj.foo)
  })

  it('can lookup undefined from an object', () => {
    const obj = {
      foo: undefined,
    }
    expect(pathGet(obj, 'foo')).toBe(obj.foo)
  })

  it('can lookup a key that is literally "null"', () => {
    const obj = {
      null: 'some value for null',
    }
    expect(pathGet(obj, 'null')).toBe(obj.null)
  })

  it('can lookup a key that is literally "undefined"', () => {
    const obj = {
      undefined: 'some value for undefined',
    }
    expect(pathGet(obj, 'undefined')).toBe(obj.undefined)
  })

  it('supports getts property', () => {
    class A {
      get x(): string {
        return 'the x value'
      }
    }
    const obj = new A()
    expect(pathGet(obj, 'x')).toBe('the x value')
  })
})

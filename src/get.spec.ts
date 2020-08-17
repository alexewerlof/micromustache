import { pathGet } from './get'

describe('pathGet()', () => {
  it('can resolve 1-level deep object', () => {
    const obj = {
      foo: 'bar',
      baz: 2,
    }
    expect(pathGet('foo', obj)).toBe('bar')
    expect(pathGet('baz', obj)).toBe(2)
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
    expect(pathGet('a.b.c.foo', obj)).toBe('bar')
  })

  it('does not throw when the value is supposed to be undefined', () => {
    const obj = {
      foo: 'bar',
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => pathGet('hello', obj)).not.toThrow()
  })

  it('throws if it cannot resolve nested objects', () => {
    const obj = {
      foo: 'bar',
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => pathGet('cux', obj, { validateRef: true })).toThrow()
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
    expect(() => pathGet('a.b.c', obj, { maxRefDepth: 2 })).toThrow()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    expect(() => pathGet('a.b.c', obj, { maxRefDepth: 3 })).not.toThrow()
  })

  it('can access array elements', () => {
    const arr = ['banana', 'apple', 'orange', 'pear']
    expect(pathGet('[1]', arr)).toBe('apple')
  })

  it('can access a nested array object', () => {
    const obj = {
      arr: ['banana', 'apple', 'orange', 'pear'],
    }
    expect(pathGet('arr[1]', obj)).toBe('apple')
  })

  it('supports array indices', () => {
    const arr = ['banana', 'mandarin', 'orange', 'pear']
    const obj = {
      fruits: ['ananas', 'kiwi'],
    }
    expect(pathGet('[1]', arr)).toBe('mandarin')
    expect(pathGet('fruits[1]', obj)).toBe('kiwi')
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

    expect(pathGet('["foo"]', obj)).toBe('bar')
    expect(pathGet(`baz["a"]['b'].c[3]`, obj)).toBe(3)
  })

  it('behaves the same as javascript when accessing keys with spaces around them', () => {
    const obj = {
      foo: 'bar',
    }
    expect(pathGet(' foo ', obj)).toBe(obj.foo)
  })

  it('behaves the same as javascript when accessing keys with quotes and spaces around them', () => {
    const obj = {
      foo: {
        bar: 'baz',
      },
    }
    expect(pathGet('foo[ "bar" ]', obj)).toBe(obj.foo.bar)
  })

  it('behaves the same as javascript when accessing array indices with spaces around them', () => {
    const obj = {
      foo: [10, 20, 30],
    }
    expect(pathGet('foo[ 1 ]', obj)).toBe(obj.foo[1])
  })

  it('can lookup null from an object', () => {
    const obj = {
      foo: null,
    }
    expect(pathGet('foo', obj)).toBe(obj.foo)
  })

  it('can lookup undefined from an object', () => {
    const obj = {
      foo: undefined,
    }
    expect(pathGet('foo', obj)).toBe(obj.foo)
  })

  it('can lookup a key that is literally "null"', () => {
    const obj = {
      null: 'some value for null',
    }
    expect(pathGet('null', obj)).toBe(obj.null)
  })

  it('can lookup a key that is literally "undefined"', () => {
    const obj = {
      undefined: 'some value for undefined',
    }
    expect(pathGet('undefined', obj)).toBe(obj.undefined)
  })

  it('supports getts property', () => {
    class A {
      get x(): string {
        return 'the x value'
      }
    }
    const obj = new A()
    expect(pathGet('x', obj)).toBe('the x value')
  })
})

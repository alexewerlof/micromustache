import { get } from './get'

describe('get()', () => {
  it('can resolve 1-level object', () => {
    const obj = {
      foo: 'bar',
      baz: 2
    }
    expect(get(obj, 'foo')).toBe('bar')
    expect(get(obj, 'baz')).toBe(2)
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
    expect(get(obj, 'a.b.c.foo')).toBe('bar')
  })

  it('does not throw when the value is supposed to be undefined', () => {
    const obj = {
      foo: 'bar'
    }
    expect(() => get(obj, 'hello')).not.toThrow()
  })

  it('throws if it cannot resolve nested objects', () => {
    const obj = {
      foo: 'bar'
    }
    expect(() => get(obj, 'hello.kitty', true)).toThrow()
  })

  it('can access array elements', () => {
    const arr = ['banana', 'apple', 'orange', 'pear']
    expect(get(arr, '[1]')).toBe('apple')
  })

  it('can access a nested array object', () => {
    const obj = {
      arr: ['banana', 'apple', 'orange', 'pear']
    }
    expect(get(obj, 'arr[1]')).toBe('apple')
  })

  it('supports array syntax', () => {
    const arr = ['banana', 'mandarin', 'orange', 'pear']
    const obj = {
      fruits: ['ananas', 'kiwi']
    }
    expect(get(arr, '[1]')).toBe('mandarin')
    expect(get(obj, 'fruits[1]')).toBe('kiwi')
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

    expect(get(obj, '["foo"]')).toBe('bar')
    expect(get(obj, `baz["a"]['b'].c[3]`)).toBe(3)
  })

  it('behaves the same as javascript when accessing keys with spaces around them', () => {
    const obj = {
      foo: 'bar'
    }
    expect(get(obj, ' foo ')).toBe(obj.foo)
  })

  it('behaves the same as javascript when accessing keys with quotes and spaces around them', () => {
    const obj = {
      foo: {
        bar: 'baz'
      }
    }
    expect(get(obj, 'foo[ "bar" ]')).toBe(obj.foo.bar)
  })

  it('behaves the same as javascript when accessing array indices with spaces around them', () => {
    const obj = {
      foo: [10, 20, 30]
    }
    expect(get(obj, 'foo[ 1 ]')).toBe(obj.foo[1])
  })
})

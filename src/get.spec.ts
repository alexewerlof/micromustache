import { expect } from 'chai'
import { get } from './get'

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
    expect(() => get(obj, 'hello.kitty', true)).to.throw()
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

  it('can lookup null from an object', () => {
    const obj = {
      foo: null
    }
    expect(get(obj, 'foo')).to.equal(obj.foo)
  })

  it('can lookup undefined from an object', () => {
    const obj = {
      foo: undefined
    }
    expect(get(obj, 'foo')).to.equal(obj.foo)
  })

  it('can lookup a key that is literally "null"', () => {
    const obj = {
      null: 'some value for null'
    }
    expect(get(obj, 'null')).to.equal(obj.null)
  })

  it('can lookup a key that is literally "undefined"', () => {
    const obj = {
      undefined: 'some value for undefined'
    }
    expect(get(obj, 'undefined')).to.equal(obj.undefined)
  })

  it('can lookup a property', () => {
    class A {
      get x() {
        return 'the x value'
      }
    }
    const obj = new A()
    expect(get(obj, 'x')).to.equal('the x value')
    expect(get(obj, '__proto__.x')).to.equal('the x value')
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert'
import { get } from '../src/get.js'

describe('get()', () => {
    it('can resolve 1-level deep object', () => {
        const obj = {
            foo: 'bar',
            baz: 2,
        }
        assert.strictEqual(get(obj, 'foo'), 'bar')
        assert.strictEqual(get(obj, 'baz'), 2)
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
        assert.strictEqual(get(obj, 'a.b.c.foo'), 'bar')
    })

    it('does not throw when the value is supposed to be undefined', () => {
        const obj = {
            foo: 'bar',
        }
        assert.doesNotThrow(() => get(obj, 'hello'))
    })

    it('throws if it cannot resolve nested objects', () => {
        const obj = {
            foo: 'bar',
        }
        assert.throws(() => get(obj, 'cux', { validateRef: true }))
    })

    it('throws if the ref is too deep', () => {
        const obj = {
            a: {
                b: {
                    c: 37.5,
                },
            },
        }
        assert.throws(() => get(obj, 'a.b.c', { maxRefDepth: 2 }))
        assert.doesNotThrow(() => get(obj, 'a.b.c', { maxRefDepth: 3 }))
    })

    it('can access array elements', () => {
        const arr = ['banana', 'apple', 'orange', 'pear']
        assert.strictEqual(get(arr, '[1]'), 'apple')
    })

    it('can access a nested array object', () => {
        const obj = {
            arr: ['banana', 'apple', 'orange', 'pear'],
        }
        assert.strictEqual(get(obj, 'arr[1]'), 'apple')
    })

    it('supports array indices', () => {
        const arr = ['banana', 'mandarin', 'orange', 'pear']
        const obj = {
            fruits: ['ananas', 'kiwi'],
        }
        assert.strictEqual(get(arr, '[1]'), 'mandarin')
        assert.strictEqual(get(obj, 'fruits[1]'), 'kiwi')
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

        assert.strictEqual(get(obj, '["foo"]'), 'bar')
        assert.strictEqual(get(obj, `baz["a"]['b'].c[3]`), 3)
    })

    it('behaves the same as javascript when accessing keys with spaces around them', () => {
        const obj = {
            foo: 'bar',
        }
        assert.strictEqual(get(obj, ' foo '), obj.foo)
    })

    it('behaves the same as javascript when accessing keys with quotes and spaces around them', () => {
        const obj = {
            foo: {
                bar: 'baz',
            },
        }
        assert.strictEqual(get(obj, 'foo[ "bar" ]'), obj.foo.bar)
    })

    it('behaves the same as javascript when accessing array indices with spaces around them', () => {
        const obj = {
            foo: [10, 20, 30],
        }
        assert.strictEqual(get(obj, 'foo[ 1 ]'), obj.foo[1])
    })

    it('can lookup null from an object', () => {
        const obj = {
            foo: null,
        }
        assert.strictEqual(get(obj, 'foo'), obj.foo)
    })

    it('can lookup undefined from an object', () => {
        const obj = {
            foo: undefined,
        }
        assert.strictEqual(get(obj, 'foo'), obj.foo)
    })

    it('can lookup a key that is literally "null"', () => {
        const obj = {
            null: 'some value for null',
        }
        assert.strictEqual(get(obj, 'null'), obj.null)
    })

    it('can lookup a key that is literally "undefined"', () => {
        const obj = {
            undefined: 'some value for undefined',
        }
        assert.strictEqual(get(obj, 'undefined'), obj.undefined)
    })

    it('supports getts property', () => {
        class A {
            get x(): string {
                return 'the x value'
            }
        }
        const obj = new A()
        assert.strictEqual(get(obj, 'x'), 'the x value')
    })
})

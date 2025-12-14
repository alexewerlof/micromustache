import { describe, it } from 'node:test'
import assert from 'node:assert'
import { compile, render, renderFn, renderFnAsync } from '../src/index.js'
import { Renderer } from '../src/renderer.js'

describe('index', () => {
    it('has a compile() function', () => {
        assert.strictEqual(typeof compile, 'function')
    })

    it('returns a renderer object as a result of compilation', () => {
        const renderer = compile('Hello {{name!}}')
        assert(renderer instanceof Renderer)
        assert.strictEqual(typeof renderer.render, 'function')
        assert.strictEqual(typeof renderer.renderFn, 'function')
        assert.strictEqual(typeof renderer.renderFnAsync, 'function')
    })

    it('has a render() function', () => {
        assert.strictEqual(typeof render, 'function')
    })

    it('has a renderFn() function', () => {
        assert.strictEqual(typeof renderFn, 'function')
    })

    it('has a renderFnAsync() function', () => {
        assert.strictEqual(typeof renderFnAsync, 'function')
    })
})

import { describe, it } from 'node:test'
import assert from 'node:assert'
import { compile } from '../src/compile.js'
import { Renderer } from '../src/renderer.js'

describe('compile()', () => {
    it('returns a Renderer instance', () => {
        const renderer = compile('Hello {{name}}!')
        assert(renderer instanceof Renderer)
        assert.strictEqual(typeof renderer.render, 'function')
    })

    it('compiles a template', () => {
        const template = 'Hello {{name}}!'
        const renderer = compile(template)
        assert(renderer instanceof Renderer)
    })

    it('passes the options to tokenizer', () => {
        const template = 'Hello <name>!'
        const renderer = compile(template, {
            tags: ['<', '>'],
        })
        assert.strictEqual(renderer.render({ name: 'Alfred' }), 'Hello Alfred!')
    })
})

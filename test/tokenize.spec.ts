import { describe, it } from 'node:test'
import assert from 'node:assert'
import { tokenize } from '../src/tokenize.js'

describe('tokenize()', () => {
    it('returns the string intact if no interpolation is found', () => {
        assert.deepStrictEqual(tokenize('Hello world'), {
            strings: ['Hello world'],
            paths: [],
        })
    })

    it('supports customized tags', () => {
        assert.deepStrictEqual(tokenize('Hello {name}!', { tags: ['{', '}'] }), {
            strings: ['Hello ', '!'],
            paths: ['name'],
        })
    })

    it('throws if the open and close tag are the same', () => {
        assert.throws(() => tokenize('Hello |name|!', { tags: ['|', '|'] }), TypeError)
    })

    it('throws if the open tag contains the close tag', () => {
        assert.throws(() => tokenize('Hello {{name}!', { tags: ['{{', '{'] }), Error)
    })

    it('throws if the open and close tag are the same', () => {
        assert.throws(() => tokenize('Hello {name}}!', { tags: ['}', '}}'] }), Error)
    })

    it('returns an empty string and no paths when the template is an empty string', () => {
        assert.deepStrictEqual(tokenize(''), {
            strings: [''],
            paths: [],
        })
    })

    it('handles interpolation correctly at the start of the template', () => {
        assert.deepStrictEqual(tokenize('{{name}}! How are you?'), {
            strings: ['', '! How are you?'],
            paths: ['name'],
        })
    })

    it('handles interpolation correctly at the end of the template', () => {
        assert.deepStrictEqual(tokenize('My name is {{name}}'), {
            strings: ['My name is ', ''],
            paths: ['name'],
        })
    })

    it('trims path', () => {
        const { paths } = tokenize('My name is {{  name  }}')
        assert.deepStrictEqual(paths, ['name'])
    })

    it('can handle a close tag without an open tag', () => {
        assert.deepStrictEqual(tokenize('Hi}} {{name}}'), {
            strings: ['Hi}} ', ''],
            paths: ['name'],
        })
        assert.deepStrictEqual(tokenize('Hi {{name}} }}'), {
            strings: ['Hi ', ' }}'],
            paths: ['name'],
        })
    })

    it('throws a syntax error if the open tag is not closed', () => {
        assert.throws(
            () => tokenize('Hi {{'),
            new SyntaxError('Missing "}}" in the template for the "{{" at position 3 within 1000 characters'),
        )
    })

    it('does not throw an error if there is a close tag without an open tag', () => {
        assert.doesNotThrow(() => tokenize('Hi}} '))
    })

    it('throws a syntax error if the path is an empty string', () => {
        assert.throws(() => tokenize('Hi {{}}'), new SyntaxError('Unexpected "}}" tag found at position 3'))
    })

    it('throws a syntax error if the value name is just spaces', () => {
        assert.throws(() => tokenize('Hi {{ }}'), new SyntaxError('Unexpected "}}" tag found at position 3'))
    })

    it('throws for nested open and close tag', () => {
        assert.throws(() => tokenize('Hello {{ {{name}} }}!'))
    })

    it('throws if the path is too long', () => {
        assert.doesNotThrow(() => tokenize('Hej {{n2345}}!', { maxPathLen: 5 }))
        assert.throws(() => tokenize('Hej {{n2345}}!', { maxPathLen: 4 }))
    })
})

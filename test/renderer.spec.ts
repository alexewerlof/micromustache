import { describe, it } from 'node:test'
import assert from 'node:assert'
import { Renderer, ResolveFn, ResolveFnAsync } from '../src/index.js'

describe('Renderer', () => {
    it('is a constructor', () => {
        assert(new Renderer({ strings: ['the string theory'], paths: [] }) instanceof Renderer)
    })

    describe('.render()', () => {
        it('renders a simple template that only contains numbers', () => {
            const renderer = new Renderer({
                strings: ['4', '6'],
                paths: ['foo'],
            })

            assert.strictEqual(renderer.render({ foo: 5 }), '456')
        })
    })

    describe('.renderFn()', () => {
        it('runs the function for every path', () => {
            const renderer = new Renderer({
                strings: ['4', '6'],
                paths: ['foo'],
            })

            function resolver(this: null, path: string): string {
                assert.strictEqual(path, 'foo')
                assert.strictEqual(this, null)
                return path.toUpperCase()
            }

            assert.strictEqual(renderer.renderFn(resolver, { foo: 5 }), '4FOO6')
        })
    })

    describe('.renderFnAsync()', () => {
        it('passes the scope to the custom resolve function', async () => {
            const resolver = new Renderer({
                strings: ['Hello! My name is ', '!'],
                paths: ['name'],
            })
            // Just returns the reversed path regardless of value
            const resolveFn: ResolveFnAsync = async (
                path,
                obj: any,
                // eslint-disable-next-line @typescript-eslint/require-await
            ) => obj[path]

            const scope = { name: 'Alex' }

            assert.strictEqual(await resolveFn('name', scope), scope.name)
            assert.strictEqual(await resolver.renderFnAsync(resolveFn, scope), 'Hello! My name is Alex!')
        })
    })
})

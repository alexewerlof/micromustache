import { Renderer, ResolveFn } from './index'

describe('Renderer', () => {
  it('is a constructor', () => {
    expect(new Renderer({ strings: ['the string theory'], refs: [] })).toEqual(expect.any(Renderer))
  })

  describe('.render()', () => {
    it('renders a simple template that only contains numbers', () => {
      const renderer = new Renderer({
        strings: ['4', '6'],
        refs: ['foo'],
      })

      expect(renderer.render({ foo: 5 })).toEqual('456')
    })
  })

  describe('.renderFn()', () => {
    it('runs the function for every ref', () => {
      const renderer = new Renderer({
        strings: ['4', '6'],
        refs: ['foo'],
      })

      function resolver(this: null, ref: string): string {
        expect(ref).toEqual('foo')
        expect(this).toEqual(null)
        return ref.toUpperCase()
      }

      expect(renderer.renderFn(resolver, { foo: 5 })).toEqual('4FOO6')
    })
  })

  describe('.renderFnAsync()', () => {
    it('passes the scope to the custom resolve function', async () => {
      const resolver = new Renderer({
        strings: ['Hello! My name is ', '!'],
        refs: ['name'],
      })
      // Just returns the reversed ref regardless of value
      const resolveFn: ResolveFn = async (
        ref,
        obj: {
          [ref: string]: string
        }
        // eslint-disable-next-line @typescript-eslint/require-await
      ) => obj[ref]

      const scope = { name: 'Alex' }

      expect(await resolveFn('name', scope)).toBe(scope.name)
      expect(await resolver.renderFnAsync(resolveFn, scope)).toBe('Hello! My name is Alex!')
    })
  })
})

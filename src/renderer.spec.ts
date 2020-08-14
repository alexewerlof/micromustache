import { Renderer, ResolveFn } from './index'

describe('Renderer', () => {
  it('is a constructor', () => {
    expect(new Renderer({ strings: ['the string theory'], paths: [] })).toEqual(
      expect.any(Renderer)
    )
  })

  describe('.render()', () => {
    it('renders a simple template that only contains numbers', () => {
      const renderer = new Renderer({
        strings: ['4', '6'],
        paths: ['foo'],
      })

      expect(renderer.render({ foo: 5 })).toEqual('456')
    })
  })

  describe('.renderFn()', () => {
    it('runs the function for every path', () => {
      const renderer = new Renderer({
        strings: ['4', '6'],
        paths: ['foo'],
      })

      function resolver(this: null, path: string): string {
        expect(path).toEqual('foo')
        expect(this).toEqual(null)
        return path.toUpperCase()
      }

      expect(renderer.renderFn(resolver, { foo: 5 })).toEqual('4FOO6')
    })
  })

  describe('.renderFnAsync()', () => {
    it('passes the scope to the custom resolve function', async () => {
      const resolver = new Renderer({
        strings: ['Hello! My name is ', '!'],
        paths: ['name'],
      })
      // Just returns the reversed path regardless of value
      const resolveFn: ResolveFn = async (
        path,
        obj: {
          [path: string]: string
        }
        // eslint-disable-next-line @typescript-eslint/require-await
      ) => obj[path]

      const scope = { name: 'Alex' }

      expect(await resolveFn('name', scope)).toBe(scope.name)
      expect(await resolver.renderFnAsync(resolveFn, scope)).toBe('Hello! My name is Alex!')
    })
  })
})

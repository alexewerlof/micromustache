import { Renderer, ResolveFn } from './index'

describe('Renderer', () => {
  it('is a constructor', () => {
    expect(
      new Renderer({ strings: ['the string theory'], varNames: [] })
    ).toEqual(expect.any(Renderer))
  })

  describe('.render()', () => {
    it('renders a simple template that only contains numbers', () => {
      const renderer = new Renderer({
        strings: ['4', '6'],
        varNames: ['foo']
      })
      expect(renderer.render({ foo: 5 })).toEqual('456')
    })
  })

  describe('.renderFn()', () => {
    it('runs the function for every varName', () => {
      const renderer = new Renderer({
        strings: ['4', '6'],
        varNames: ['foo']
      })
      function resolver(this: null, varName: string): string {
        expect(varName).toEqual('foo')
        expect(this).toEqual(null)
        return varName.toUpperCase()
      }
      expect(renderer.renderFn(resolver, { foo: 5 })).toEqual('4FOO6')
    })
  })

  describe('.renderFnAsync()', () => {
    it('passes the scope to the custom resolve function', async () => {
      const resolver = new Renderer({
        strings: ['Hello! My name is ', '!'],
        varNames: ['name']
      })
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFn = async (
        varName,
        obj: {
          [varName: string]: string
        }
      ) => obj[varName]

      const scope = { name: 'Alex' }
      expect(await resolveFn('name', scope)).toBe(scope.name)
      expect(await resolver.renderFnAsync(resolveFn, scope)).toBe(
        'Hello! My name is Alex!'
      )
    })
  })
})

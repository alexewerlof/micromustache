import { Renderer, ResolveFn } from './index'

describe('Renderer', () => {
  it('is a constructor', () => {
    expect(
      new Renderer({ strings: ['the string theory'], varNames: [] })
    ).toEqual(expect.any(Renderer))
  })

  // describe('.render()', () => {})

  // describe('.renderFn()', () => {})

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

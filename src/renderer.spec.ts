import { Renderer, ResolveFn } from './index'
import { expect } from 'chai'
import { describe } from 'mocha'

describe('Renderer', () => {
  it('is a constructor', () => {
    expect(
      new Renderer({ strings: ['the string theory'], varNames: [] })
    ).to.be.an('object')
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
      expect(await resolveFn('name', scope)).to.equal(scope.name)
      expect(await resolver.renderFnAsync(resolveFn, scope)).to.equal(
        'Hello! My name is Alex!'
      )
    })
  })
})

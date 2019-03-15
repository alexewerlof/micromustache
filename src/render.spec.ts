import {
  render,
  renderFn,
  renderFnAsync,
  ResolveFn,
  ResolveFnAsync
} from './index'
import { expect } from 'chai'
import { describe } from 'mocha'

describe('Renderer', () => {
  describe('.render()', () => {
    it('uses get() by default', () => {
      expect(render('Hello! My name is {{name}}!', { name: 'Alex' })).to.equal(
        'Hello! My name is Alex!'
      )
    })
  })

  describe('.renderFn()', () => {
    it('calls the custom resolve function', () => {
      // Just returns the reversed variable name regardless of value
      const reverseString: ResolveFn = varName =>
        varName
          .split('')
          .reverse()
          .join('')

      expect(reverseString('Alex')).to.equal('xelA')
      expect(
        renderFn('Hello! My name is {{name}}!', reverseString, {
          name: 'Alex'
        })
      ).to.equal('Hello! My name is eman!')
    })

    it('passes the scope to the custom resolve function', () => {
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFn = (
        varName,
        obj: {
          [varName: string]: string
        }
      ) => obj[varName]

      const scope = { name: 'Alex' }
      expect(resolveFn('name', scope)).to.equal(scope.name)
      expect(
        renderFn('Hello! My name is {{name}}!', resolveFn, scope)
      ).to.equal('Hello! My name is Alex!')
    })
  })

  describe('.renderFnAsync()', () => {
    it('passes the scope to the custom resolve function', async () => {
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFnAsync = async (
        varName,
        obj: {
          [varName: string]: string
        }
      ) => obj[varName]

      const scope = { name: 'Alex' }
      expect(await resolveFn('name', scope)).to.equal(scope.name)
      expect(
        await renderFnAsync('Hello! My name is {{name}}!', resolveFn, scope)
      ).to.equal('Hello! My name is Alex!')
    })
  })
})

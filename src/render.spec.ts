import { Renderer, ResolveFn, render } from './render'
import { expect } from 'chai'
import { describe } from 'mocha'

describe('Renderer', () => {
  it('is a constructor', () => {
    expect(new Renderer({ strings: [], values: [] }, {})).to.be.an('object')
  })

  describe('.render()', () => {
    it('uses get() by default', () => {
      expect(render('Hello! My name is {{name}}!', { name: 'Alex' })).to.equal(
        'Hello! My name is Alex!'
      )
    })

    it('calls the custom resolve function', () => {
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFn = varName =>
        varName
          .split('')
          .reverse()
          .join('')

      expect(resolveFn('Alex')).to.equal('xelA')
      expect(
        render('Hello! My name is {{name}}!', { name: 'Alex' }, { resolveFn })
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
        render('Hello! My name is {{name}}!', scope, { resolveFn })
      ).to.equal('Hello! My name is Alex!')
    })
  })

  describe('.renderAsync()', () => {
    it('passes the scope to the custom resolve function', async () => {
      const resolver = new Renderer(
        { strings: ['Hello! My name is ', '!'], values: ['name'] },
        {}
      )
      // Just returns the reversed variable name regardless of value
      const resolveFn: ResolveFn = async (
        varName,
        obj: {
          [varName: string]: string
        }
      ) => obj[varName]

      const scope = { name: 'Alex' }
      expect(await resolveFn('name', scope)).to.equal(scope.name)
      expect(await resolver.renderAsync(scope, resolveFn)).to.equal(
        'Hello! My name is Alex!'
      )
    })
  })
})

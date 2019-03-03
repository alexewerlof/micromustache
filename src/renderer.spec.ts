import { Renderer, ResolveFn, stringify, render } from './renderer'
import { expect } from 'chai'
import { describe } from 'mocha'

describe('stringify()', () => {
  it('returns string as they are', () => {
    expect(stringify('')).to.equal('')
    expect(stringify('hello')).to.equal('hello')
    expect(stringify('{{not interpolating}}')).to.equal('{{not interpolating}}')
  })

  it('returns booleans', () => {
    // Later when whe join(), they'll be converted to string so we don't make extra objects
    expect(stringify(true), 'true').to.equal('true')
    expect(stringify(false), 'false').to.equal('false')
  })

  it('returns numbers', () => {
    expect(stringify(1), 'positive integer').to.equal('1')
    expect(stringify(-1), 'negative integer').to.equal('-1')
    expect(stringify(0), 'zero').to.equal('0')
    expect(stringify(Number.POSITIVE_INFINITY), '∞').to.equal('∞')
    expect(stringify(Number.NEGATIVE_INFINITY), '-∞').to.equal('-∞')
  })

  it('returns NaN', () => {
    expect(stringify(Number.NaN), 'NaN').to.deep.equal('NaN')
  })

  it('returns empty string for null', () => {
    expect(stringify(null)).to.equal('')
  })

  it('returns empty string for undefined', () => {
    expect(stringify(undefined)).to.equal('')
  })

  it('returns a JSON stringified object', () => {
    const obj = {
      foo: {
        bar: 'baz'
      }
    }
    expect(stringify(obj)).to.equal(JSON.stringify(obj))
  })

  it('returns {...} for objects it cannot JSON.stringify()', () => {
    const obj = {}
    // @ts-ignore
    obj.loop = obj
    expect(stringify(obj)).to.equal('{...}')
  })

  it('returns the value of the invalidObj option for objects it cannot JSON.stringify()', () => {
    const obj = {}
    // @ts-ignore
    obj.loop = obj
    const invalidObj = 'XXX'
    expect(stringify(obj, { invalidObj })).to.equal(invalidObj)
  })

  it('returns empty string for invalid types', () => {
    const f = () => 13
    expect(stringify(f)).to.equal('')
  })

  it('returns the value of the invalidType for invalid types', () => {
    const f = () => 13
    const invalidType = 'XXX'
    expect(stringify(f, { invalidType })).to.equal(invalidType)
  })
})

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

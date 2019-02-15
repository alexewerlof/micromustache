import { expect } from 'chai'
import { compile } from './compile'
import { Resolver } from './resolver'

describe('compile()', () => {
  it('returns a function', () => {
    const resolver = compile('Hello {{name}}!')
    expect(resolver).to.be.an('object')
    expect(resolver.render).to.be.a('function')
  })

  it('compiles a template', () => {
    const template = 'Hello {{name}}!'
    const resolver = compile(template)
    expect(resolver).to.be.instanceOf(Resolver)
  })

  it('compiles an empty template', () => {
    const resolver = compile('')
    expect(resolver).to.be.instanceOf(Resolver)
  })
})

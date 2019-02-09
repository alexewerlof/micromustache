import { expect } from 'chai'
import { compile } from './compile'

describe('compile()', () => {
  it('returns a function', () => {
    const resolver = compile('Hello {{name}}!')
    expect(resolver).to.be.an('object')
    expect(resolver.render).to.be.a('function')
  })

  it('compiles a template', () => {
    const template = 'Hello {{name}}!'
    const view = { name: 'Alex' }
    const view2 = { foo: 'Alex' }
    const resolver = compile(template)
    expect(resolver.render(view)).to.equal('Hello Alex!')
    expect(resolver.render(view2)).to.equal('Hello !')
  })

  it('compiles an empty template', () => {
    const resolver = compile('')
    expect(resolver.render({})).to.equal('')
  })

  it('supports custom open and close symbols', () => {
    const resolver = compile('Hello (mate)!', {
      openSymbol: '(',
      closeSymbol: ')'
    })
    expect(resolver.render({ mate: 'Alex' })).to.equal('Hello Alex!')
  })
})

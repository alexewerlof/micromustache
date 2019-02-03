import { expect } from 'chai'
import { compile } from './compile'

describe('compile()', () => {
  it('returns a function', () => {
    const compiler = compile('Hello {{name}}!')
    expect(compiler).to.be.a('function')
  })

  it('compiles a template', () => {
    const template = 'Hello {{name}}!'
    const view = { name: 'Alex' }
    const view2 = { foo: 'Alex' }
    const compiler = compile(template)
    expect(compiler(view)).to.equal('Hello Alex!')
    expect(compiler(view2)).to.equal('Hello !')
  })

  it('compiles an empty template', () => {
    const compiler = compile('')
    expect(compiler).to.be.a('function')
    expect(compiler({})).to.equal('')
  })

  it('supports custom open and close symbols', () => {
    const compiler = compile('Hello (mate)!', {
      openSymbol: '(',
      closeSymbol: ')'
    })
    expect(compiler({ mate: 'Alex' })).to.equal('Hello Alex!')
  })
})

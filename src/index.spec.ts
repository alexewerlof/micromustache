import { describe } from 'mocha'
import { expect } from 'chai'
import { compile, render, renderFn, renderFnAsync } from './index'
import { Renderer } from './renderer'

describe('index', () => {
  it('has a compile() function', () => {
    expect(compile).to.be.a('function')
  })

  it('returns a renderer object as a result of compilation', () => {
    const renderer = compile('Hello {{name!}}')
    expect(renderer).to.be.instanceOf(Renderer)
    expect(renderer.render).to.be.a('function')
    expect(renderer.renderFn).to.be.a('function')
    expect(renderer.renderFnAsync).to.be.a('function')
  })

  it('has a render() function', () => {
    expect(render).to.be.a('function')
  })

  it('has a renderFn() function', () => {
    expect(renderFn).to.be.a('function')
  })

  it('has a renderFnAsync() function', () => {
    expect(renderFnAsync).to.be.a('function')
  })
})

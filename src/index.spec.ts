import { compile, render, renderFn, renderFnAsync } from './index'
import { Renderer } from './renderer'

describe('index', () => {
  it('has a compile() function', () => {
    expect(typeof compile).toBe('function')
  })

  it('returns a renderer object as a result of compilation', () => {
    const renderer = compile('Hello {{name!}}')
    expect(renderer).toBeInstanceOf(Renderer)
    expect(typeof renderer.render).toBe('function')
    expect(typeof renderer.renderFn).toBe('function')
    expect(typeof renderer.renderFnAsync).toBe('function')
  })

  it('has a render() function', () => {
    expect(typeof render).toBe('function')
  })

  it('has a renderFn() function', () => {
    expect(typeof renderFn).toBe('function')
  })

  it('has a renderFnAsync() function', () => {
    expect(typeof renderFnAsync).toBe('function')
  })
})

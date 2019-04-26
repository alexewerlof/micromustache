import { describe } from 'mocha'
import { expect } from 'chai'
import { compile, render, renderFn, renderFnAsync } from './index'

describe('index', () => {
  it('compile', () => {
    expect(compile).to.be.a('function')
  })

  it('render', () => {
    expect(render).to.be.a('function')
  })

  it('renderFn', () => {
    expect(renderFn).to.be.a('function')
  })

  it('renderFnAsync', () => {
    expect(renderFnAsync).to.be.a('function')
  })
})

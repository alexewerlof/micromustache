import { compile, render } from './index'

describe('index', () => {
  it('has a compile() function', () => {
    expect(typeof compile).toBe('function')
  })

  it('has a render() function', () => {
    expect(typeof render).toBe('function')
  })
})

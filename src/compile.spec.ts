import { compile } from './compile'
import { Renderer } from './renderer'

describe('compile()', () => {
  it('returns a Renderer instance', () => {
    const renderer = compile('Hello {{name}}!')
    expect(renderer).toBeInstanceOf(Renderer)
    expect(typeof renderer.render).toBe('function')
  })

  it('compiles a template', () => {
    const template = 'Hello {{name}}!'
    const renderer = compile(template)
    expect(renderer).toBeInstanceOf(Renderer)
  })

  it('passes the options to tokenizer', () => {
    const template = 'Hello <name>!'
    const renderer = compile(template, {
      tags: ['<', '>'],
    })
    expect(renderer.render({ name: 'Alfred'})).toBe('Hello Alfred!')
  })
})

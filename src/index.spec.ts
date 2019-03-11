import { expect } from 'chai'
import { describe } from 'mocha'
import { compile } from './index'
import { Renderer } from './renderer'

describe('compile()', () => {
  it('returns a function', () => {
    const renderer = compile('Hello {{name}}!')
    expect(renderer).to.be.an('object')
    expect(renderer.render).to.be.a('function')
  })

  it('compiles a template', () => {
    const template = 'Hello {{name}}!'
    const renderer = compile(template)
    expect(renderer).to.be.instanceOf(Renderer)
  })

  it('compiles an empty template', () => {
    const renderer = compile('')
    expect(renderer).to.be.instanceOf(Renderer)
  })

  describe('.render()', () => {
    it('returns an empty string if the template is empty', () => {
      const renderer = compile('')
      expect(renderer.render({})).to.equal('')
      expect(
        renderer.render({
          a: 'b'
        })
      ).to.equal('')
    })

    it('assumes empty value if the key does not exist', () => {
      expect(compile('{{i}}').render({})).to.equal('')
    })

    it('assumes empty value if the key is missing', () => {
      expect(
        compile('{{i}}').render({
          j: 1
        })
      ).to.equal('')
    })

    it('can replace a single variable', () => {
      expect(
        compile('{{i}}').render({
          i: 'hello'
        })
      ).to.equal('hello')
      expect(
        compile('{{i}} world').render({
          i: 'hello'
        })
      ).to.equal('hello world')
      expect(
        compile('Ohoy! {{i}}').render({
          i: 'hello'
        })
      ).to.equal('Ohoy! hello')
      expect(
        compile('Ohoy! {{i}} world').render({
          i: 'hello'
        })
      ).to.equal('Ohoy! hello world')
    })

    it('can replace two variables', () => {
      expect(
        compile('{{i}}{{j}}').render({
          i: 'hello',
          j: 'world'
        })
      ).to.equal('helloworld')
      expect(
        compile('{{i}} {{j}}').render({
          i: 'hello',
          j: 'world'
        })
      ).to.equal('hello world')
      expect(
        compile('{{i}} {{j}} {{k}}').render({
          i: 'hello',
          j: 'world'
        })
      ).to.equal('hello world ')
      expect(
        compile('{{var1}} {{var2}}').render({
          var1: 'hello',
          var2: 'world'
        })
      ).to.equal('hello world')
    })

    it('interpolates all variables with empty string when scope is empty', () => {
      expect(compile('{{i}}').render({})).to.equal('')
    })

    it('interpolates all variables with empty string when scope is missing', () => {
      expect(compile('{{i}}{{j}}').render()).to.equal('')
      expect(compile('{{i}} {{j}}').render()).to.equal(' ')
      expect(compile(' {{abc}} {{def}} ').render()).to.equal('   ')
    })

    it('allows $ as a value', () => {
      expect(
        compile('{{a}}').render({
          a: '$'
        })
      ).to.equal('$')
      expect(
        compile('{{a}}').render({
          a: ' $'
        })
      ).to.equal(' $')
      expect(
        compile('{{a}}').render({
          a: '$ '
        })
      ).to.equal('$ ')
      expect(
        compile('{{a}}').render({
          a: '$$'
        })
      ).to.equal('$$')
      expect(
        compile('{{a}}').render({
          a: '$&'
        })
      ).to.equal('$&')
      expect(
        compile('{{a}}').render({
          a: '$`'
        })
      ).to.equal('$`')
      expect(
        compile('{{a}}').render({
          a: "$'"
        })
      ).to.equal("$'")
      expect(
        compile('{{a}}').render({
          a: '$1'
        })
      ).to.equal('$1')
    })

    it('deals with boolean values properly', () => {
      expect(
        compile('{{a}}').render({
          a: true
        })
      ).to.equal('true')
      expect(
        compile('{{a}}').render({
          a: false
        })
      ).to.equal('false')
    })

    it('deals with numerical values properly', () => {
      expect(
        compile('{{a}}').render({
          a: 0
        })
      ).to.equal('0')
      expect(
        compile('{{a}}').render({
          a: 1
        })
      ).to.equal('1')
      expect(
        compile('{{a}}').render({
          a: 999
        })
      ).to.equal('999')
      expect(
        compile('{{a}}').render({
          a: Number.NaN
        })
      ).to.equal('NaN')
    })

    it('ignores null or undefined values properly', () => {
      expect(
        compile('a{{b}}c').render({
          b: null
        })
      ).to.equal('ac')
      expect(
        compile('a{{b}}c').render({
          b: undefined
        })
      ).to.equal('ac')
    })

    it('ignores a variable name with space in it', () => {
      expect(
        compile('{{a b}}').render({
          a: 1,
          b: 2,
          ab: 3
        })
      ).to.equal('')
    })

    it('can handle spaces before and after variable names', () => {
      expect(
        compile('-{{ a}}-{{b }}-{{ cc }}-').render({
          a: '1',
          b: true,
          cc: 33
        })
      ).to.equal('-1-true-33-')
    })

    it('multiple occurances of the variable', () => {
      expect(
        compile('{{a}}{{a}}{{a}}').render({
          a: 'hello'
        })
      ).to.equal('hellohellohello')
      expect(
        compile('{{a}}{{b}}{{a}}{{b}}').render({
          a: '1',
          b: '2'
        })
      ).to.equal('1212')
    })

    it('can access array elements', () => {
      expect(
        compile('I like {{0}}, {{1}} and {{2}}').render([
          'orange',
          'apple',
          'lemon'
        ])
      ).to.equal('I like orange, apple and lemon')
    })

    it('can access array length', () => {
      expect(compile('{{length}}').render([])).to.equal('0')
    })

    it('accepts a function as scope', () => {
      // tslint:disable-next-line no-empty
      function scope() {}
      scope.A = 'Cat'
      expect(compile('X={{A}}').render(scope)).to.equal('X=Cat')
    })

    it('accepts class as scope', () => {
      class Parent {
        constructor(public B = 'Mobile') {}
      }
      // tslint:disable-next-line max-classes-per-file
      class Scope extends Parent {
        constructor(public A = 'Crocodile') {
          super()
        }
      }
      const scope = new Scope()
      // @ts-ignore
      scope.C = 'Alice'
      expect(compile('{{A}} or {{B}} and {{C}}').render(scope)).to.equal(
        'Crocodile or Mobile and Alice'
      )
    })

    it('can access nested objects', () => {
      expect(
        compile('{{a}} {{b.c}}').render({
          a: 'hello',
          b: {
            c: 'world'
          }
        })
      ).to.equal('hello world')
      expect(
        compile('{{a}}{{b.c}}').render({
          a: 1,
          b: {
            c: 2
          }
        })
      ).to.equal('12')
    })

    it('can access nested objects with three level nesting', () => {
      expect(
        compile('{{a}}{{b.c.d}}').render({
          a: 1,
          b: {
            c: {
              d: 3
            }
          }
        })
      ).to.equal('13')
    })

    it('can access nested objects with six level nesting', () => {
      expect(
        compile('{{a.b.c.d.e.f}}').render({
          a: {
            b: {
              c: {
                d: {
                  e: {
                    f: 'finally!'
                  }
                }
              }
            }
          }
        })
      ).to.equal('finally!')
    })

    it('if one of the nested keys do not exist, it throws', () => {
      expect(() =>
        compile('{{a.b.c.d.e.f}}').render({
          a: {
            b: {
              c: {
                d: {
                  z: {
                    x: 'finally!'
                  }
                }
              }
            }
          }
        })
      ).to.throw()
    })

    it('can access nested objects with array index', () => {
      expect(
        compile('{{a}}-{{b.1}}').render({
          a: 'a',
          b: [10, 11]
        })
      ).to.equal('a-11')
    })

    it('can access objects in an array', () => {
      expect(
        compile('{{a.1.b.c}}').render({
          a: [
            {
              b: { c: 11 }
            },
            {
              b: { c: 13 }
            }
          ]
        })
      ).to.equal('13')
    })

    it('works for Michael Jackson, so it should work for everyone', () => {
      // I don't have a thing with MJ. Just improvised and it stuck there!
      const singer = {
        first: 'Michael',
        last: 'Jackson',
        children: [
          {
            first: 'Paris-Michael',
            middle: 'Katherine'
          },
          {
            first: 'Prince',
            middle: 'Michael',
            prefix: 'II'
          },
          {
            first: 'Michael',
            middle: 'Joseph',
            prefix: 'Jr.'
          }
        ]
      }
      expect(
        compile(
          '{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, ' +
            '{{children.1.first}} and {{children.2.first}}'
        ).render(singer)
      ).to.equal(
        'Michael Jackson had 3 children: Paris-Michael, Prince and Michael'
      )
    })
  })
})

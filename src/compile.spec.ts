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

  it('compiles an empty template', () => {
    const renderer = compile('')
    expect(renderer).toBeInstanceOf(Renderer)
  })

  describe('.render()', () => {
    it('returns an empty string if the template is empty', () => {
      const renderer = compile('')
      expect(renderer.render({})).toBe('')
      expect(
        renderer.render({
          a: 'b'
        })
      ).toBe('')
    })

    it('assumes empty value if the key does not exist', () => {
      expect(compile('{{i}}').render({})).toBe('')
    })

    it('assumes empty value if the key is missing', () => {
      expect(
        compile('{{i}}').render({
          j: 1
        })
      ).toBe('')
    })

    it('can interpolate a single variable', () => {
      expect(
        compile('{{i}}').render({
          i: 'hello'
        })
      ).toBe('hello')
      expect(
        compile('{{i}} world').render({
          i: 'hello'
        })
      ).toBe('hello world')
      expect(
        compile('Ohoy! {{i}}').render({
          i: 'hello'
        })
      ).toBe('Ohoy! hello')
      expect(
        compile('Aloha! {{i}} world').render({
          i: 'hello'
        })
      ).toBe('Aloha! hello world')
    })

    it('can replace two variables', () => {
      expect(
        compile('{{i}}{{j}}').render({
          i: 'hello',
          j: 'world'
        })
      ).toBe('helloworld')
      expect(
        compile('{{i}} {{j}}').render({
          i: 'hello',
          j: 'world'
        })
      ).toBe('hello world')
      expect(
        compile('{{i}} {{j}} {{k}}').render({
          i: 'hello',
          j: 'world'
        })
      ).toBe('hello world ')
      expect(
        compile('{{var1}} {{var2}}').render({
          var1: 'hello',
          var2: 'world'
        })
      ).toBe('hello world')
    })

    it('interpolates all variables with empty string when scope is empty', () => {
      expect(compile('{{i}}').render({})).toBe('')
    })

    it('interpolates all variables with empty string when scope is missing', () => {
      expect(compile('{{i}}{{j}}').render()).toBe('')
      expect(compile('{{i}} {{j}}').render()).toBe(' ')
      expect(compile(' {{abc}} {{def}} ').render()).toBe('   ')
    })

    it('allows $ as a value', () => {
      expect(
        compile('{{a}}').render({
          a: '$'
        })
      ).toBe('$')
      expect(
        compile('{{a}}').render({
          a: ' $'
        })
      ).toBe(' $')
      expect(
        compile('{{a}}').render({
          a: '$ '
        })
      ).toBe('$ ')
      expect(
        compile('{{a}}').render({
          a: '$$'
        })
      ).toBe('$$')
      expect(
        compile('{{a}}').render({
          a: '$&'
        })
      ).toBe('$&')
      expect(
        compile('{{a}}').render({
          a: '$`'
        })
      ).toBe('$`')
      expect(
        compile('{{a}}').render({
          a: "$'"
        })
      ).toBe("$'")
      expect(
        compile('{{a}}').render({
          a: '$1'
        })
      ).toBe('$1')
    })

    it('deals with boolean values properly', () => {
      expect(
        compile('{{a}}').render({
          a: true
        })
      ).toBe('true')
      expect(
        compile('{{a}}').render({
          a: false
        })
      ).toBe('false')
    })

    it('deals with numerical values properly', () => {
      expect(
        compile('{{a}}').render({
          a: 0
        })
      ).toBe('0')
      expect(
        compile('{{a}}').render({
          a: 1
        })
      ).toBe('1')
      expect(
        compile('{{a}}').render({
          a: 999
        })
      ).toBe('999')
      expect(
        compile('{{a}}').render({
          a: Number.NaN
        })
      ).toBe('NaN')
    })

    it('ignores null or undefined values properly', () => {
      expect(
        compile('a{{b}}c').render({
          b: null
        })
      ).toBe('ac')
      expect(
        compile('a{{b}}c').render({
          b: undefined
        })
      ).toBe('ac')
    })

    it('ignores a variable name with space in it', () => {
      expect(
        compile('{{a b}}').render({
          a: 1,
          b: 2,
          ab: 3
        })
      ).toBe('')
    })

    it('can handle spaces before and after variable names', () => {
      expect(
        compile('-{{ a}}-{{b }}-{{ cc }}-').render({
          a: '1',
          b: true,
          cc: 33
        })
      ).toBe('-1-true-33-')
    })

    it('multiple occurances of the variable', () => {
      expect(
        compile('{{a}}{{a}}{{a}}').render({
          a: 'hello'
        })
      ).toBe('hellohellohello')
      expect(
        compile('{{a}}{{b}}{{a}}{{b}}').render({
          a: '1',
          b: '2'
        })
      ).toBe('1212')
    })

    it('can access array elements', () => {
      expect(
        compile('I like {{0}}, {{1}} and {{2}}').render([
          'orange',
          'apple',
          'lemon'
        ])
      ).toBe('I like orange, apple and lemon')
    })

    it('can access array length', () => {
      expect(compile('{{length}}').render([])).toBe('0')
    })

    it('accepts a function as scope', () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      function scope(): void {}
      scope.A = 'Cat'
      expect(compile('X={{A}}').render(scope)).toBe('X=Cat')
    })

    it('accepts class as scope', () => {
      class Parent {
        constructor(public B = 'Mobile') {}
      }
      class Scope extends Parent {
        public C: string;
        constructor(public A = 'Crocodile') {
          super()
        }
      }
      const scope = new Scope()
      scope.C = 'Alice'
      expect(compile('{{A}} or {{B}} and {{C}}').render(scope)).toBe(
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
      ).toBe('hello world')
      expect(
        compile('{{a}}{{b.c}}').render({
          a: 1,
          b: {
            c: 2
          }
        })
      ).toBe('12')
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
      ).toBe('13')
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
      ).toBe('finally!')
    })

    it('if one of the nested keys do not exist, it throws', () => {
      expect(() =>
        compile('{{a.b.c.d.e.f}}', { propsExist: true }).render({
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
      ).toThrow()
    })

    it('can access nested objects with array index', () => {
      expect(
        compile('{{a}}-{{b.1}}').render({
          a: 'a',
          b: [10, 11]
        })
      ).toBe('a-11')
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
      ).toBe('13')
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
      ).toBe(
        'Michael Jackson had 3 children: Paris-Michael, Prince and Michael'
      )
    })
  })
})

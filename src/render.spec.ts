import { render, renderFn, renderFnAsync, ResolveFn, ResolveFnAsync } from './index'

describe('render', () => {
  describe('.render()', () => {
    it('uses get() by default', () => {
      expect(render('Hello! My name is {{name}}!', { name: 'Alex' })).toBe(
        'Hello! My name is Alex!'
      )
    })

    it('returns an empty string if the template is empty', () => {
      expect(render('')).toBe('')
    })

    it('assumes empty value if the key does not exist', () => {
      expect(render('{{i}}', {})).toBe('')
    })

    it('can interpolate a single variable', () => {
      expect(
        render('{{i}}', {
          i: 'hello',
        })
      ).toBe('hello')
      expect(
        render('{{i}} world', {
          i: 'hello',
        })
      ).toBe('hello world')
      expect(
        render('Ahoy! {{i}}', {
          i: 'hello',
        })
      ).toBe('Ahoy! hello')
      expect(
        render('Aloha! {{i}} world', {
          i: 'hello',
        })
      ).toBe('Aloha! hello world')
    })

    it('can replace two variables', () => {
      expect(
        render('{{i}} {{j}}', {
          i: 'hello',
          j: 'world',
        })
      ).toBe('hello world')
      expect(
        render('{{i}} {{j}}', {
          i: 'hello',
          j: 'world',
        })
      ).toBe('hello world')
      expect(
        render('{{i}} {{j}} {{k}}', {
          i: 'hello',
          j: 'world',
        })
      ).toBe('hello world ')
      expect(
        render('{{var1}} {{var2}}', {
          var1: 'hello',
          var2: 'world',
        })
      ).toBe('hello world')
    })

    it('deals with boolean values properly', () => {
      expect(
        render('{{a}}', {
          a: true,
        })
      ).toBe('true')
      expect(
        render('{{a}}', {
          a: false,
        })
      ).toBe('false')
    })

    it('deals with numerical values properly', () => {
      expect(
        render('{{a}}', {
          a: 0,
        })
      ).toBe('0')
      expect(
        render('{{a}}', {
          a: 1,
        })
      ).toBe('1')
      expect(
        render('{{a}}', {
          a: 999,
        })
      ).toBe('999')
      expect(
        render('{{a}}', {
          a: Number.NaN,
        })
      ).toBe('NaN')
    })

    it('ignores null or undefined values properly', () => {
      expect(
        render('a{{b}}c', {
          b: null,
        })
      ).toBe('ac')
      expect(
        render('a{{b}}c', {
          b: undefined,
        })
      ).toBe('ac')
    })

    it('throws for an invalid ref', () => {
      expect(() =>
        render('{{a b}}', {
          a: 1,
          b: 2,
          ab: 3,
        })
      ).toThrow()
    })

    it('can interpolate multiple occupance of the variable', () => {
      expect(
        render('{{a}}{{a}}{{a}}', {
          a: 'hello',
        })
      ).toBe('hellohellohello')
      expect(
        render('{{a}}{{b}}{{a}}{{b}}', {
          a: '1',
          b: '2',
        })
      ).toBe('1212')
    })

    it('can access array elements', () => {
      expect(render('I like {{0}}, {{1}} and {{2}}', ['orange', 'apple', 'lemon'])).toBe(
        'I like orange, apple and lemon'
      )
    })

    it('can access array length', () => {
      expect(render('{{length}}', [])).toBe('0')
    })

    it('accepts class as scope', () => {
      class Parent {
        constructor(public B = 'Mobile') {}
      }
      class Scope extends Parent {
        public C: string
        constructor(public A = 'Crocodile') {
          super()
        }
      }
      const scope = new Scope()
      scope.C = 'Alice'
      expect(render('{{A}} or {{B}} and {{C}}', scope)).toBe('Crocodile or Mobile and Alice')
    })

    it('can access nested objects', () => {
      expect(
        render('{{a}} {{b.c}}', {
          a: 'hello',
          b: {
            c: 'world',
          },
        })
      ).toBe('hello world')
      expect(
        render('{{a}}{{b.c}}', {
          a: 1,
          b: {
            c: 2,
          },
        })
      ).toBe('12')
    })

    it('can access nested objects with three level nesting', () => {
      expect(
        render('{{a}}{{b.c.d}}', {
          a: 1,
          b: {
            c: {
              d: 3,
            },
          },
        })
      ).toBe('13')
    })

    it('can access nested objects with six level nesting', () => {
      expect(
        render('{{a.b.c.d.e.f}}', {
          a: {
            b: {
              c: {
                d: {
                  e: {
                    f: 'finally!',
                  },
                },
              },
            },
          },
        })
      ).toBe('finally!')
    })

    it('if one of the nested keys do not exist, it throws', () => {
      expect(() =>
        render(
          '{{a.b.c.d.e}}',
          {
            a: {
              b: {
                c: {
                  d: {
                    z: 'Zee?!',
                  },
                },
              },
            },
          },
          { validatePath: true }
        )
      ).toThrow()
    })

    it('can access nested objects with array index', () => {
      expect(
        render('{{a}}-{{b.1}}', {
          a: 'a',
          b: [10, 11],
        })
      ).toBe('a-11')
    })

    it('can access objects in an array', () => {
      expect(
        render('{{a.1.b.c}}', {
          a: [
            {
              b: { c: 11 },
            },
            {
              b: { c: 13 },
            },
          ],
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
            middle: 'Katherine',
          },
          {
            first: 'Prince',
            middle: 'Michael',
            prefix: 'II',
          },
          {
            first: 'Michael',
            middle: 'Joseph',
            prefix: 'Jr.',
          },
        ],
      }
      expect(
        render(
          '{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, ' +
            '{{children.1.first}} and {{children.2.first}}',
          singer
        )
      ).toBe('Michael Jackson had 3 children: Paris-Michael, Prince and Michael')
    })
  })

  describe('.renderFn()', () => {
    it('calls the custom resolve function', () => {
      // Just returns the reversed ref regardless of value
      const reverseString: ResolveFn = (ref) => ref.split('').reverse().join('')

      expect(reverseString('Alex')).toBe('xelA')
      expect(
        renderFn('Hello! My name is {{name}}!', reverseString, {
          name: 'Alex',
        })
      ).toBe('Hello! My name is eman!')
    })

    it('passes the scope to the custom resolve function', () => {
      // Just returns the reversed ref regardless of value
      const resolveFn: ResolveFn = (
        ref,
        obj: {
          [ref: string]: string
        }
      ) => obj[ref]

      const scope = { name: 'Alex' }
      expect(resolveFn('name', scope)).toBe(scope.name)
      expect(renderFn('Hello! My name is {{name}}!', resolveFn, scope)).toBe(
        'Hello! My name is Alex!'
      )
    })
  })

  describe('.renderFnAsync()', () => {
    it('passes the scope to the custom resolve function', async () => {
      // Just returns the reversed ref regardless of value
      const resolveFn: ResolveFnAsync = async (
        ref,
        obj: {
          [ref: string]: string
        }
        // eslint-disable-next-line @typescript-eslint/require-await
      ): Promise<string | undefined> => obj[ref]

      const scope = { name: 'Alex' }
      expect(await resolveFn('name', scope)).toBe(scope.name)
      expect(await renderFnAsync('Hello! My name is {{name}}!', resolveFn, scope)).toBe(
        'Hello! My name is Alex!'
      )
    })
  })
})

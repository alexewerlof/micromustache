import { expect } from 'chai'
import { render } from './render'
import { NameToken } from './tokenize'
import { Resolver } from './compile'

describe('render()', () => {
  it('is a function', () => {
    expect(render).to.be.a('function')
  })

  it('throws for non-string templates', () => {
    // @ts-ignore
    expect(() => render(1)).to.throw()
    // @ts-ignore
    expect(() => render(null, {})).to.throw()
    // @ts-ignore
    expect(() => render(true, {})).to.throw()
  })

  it('returns an empty string if the template is empty', () => {
    expect(render('', {})).to.equal('')
    expect(
      render('', {
        a: 'b'
      })
    ).to.equal('')
  })

  it('assumes empty value if the key does not exist', () => {
    expect(render('{{i}}', {})).to.equal('')
  })

  it('assumes empty value if the key is missing', () => {
    expect(
      render('{{i}}', {
        j: 1
      })
    ).to.equal('')
  })

  it('can replace a single variable', () => {
    expect(
      render('{{i}}', {
        i: 'hello'
      })
    ).to.equal('hello')
    expect(
      render('{{i}} world', {
        i: 'hello'
      })
    ).to.equal('hello world')
    expect(
      render('Ohoy! {{i}}', {
        i: 'hello'
      })
    ).to.equal('Ohoy! hello')
    expect(
      render('Ohoy! {{i}} world', {
        i: 'hello'
      })
    ).to.equal('Ohoy! hello world')
  })

  it('can replace two variables', () => {
    expect(
      render('{{i}}{{j}}', {
        i: 'hello',
        j: 'world'
      })
    ).to.equal('helloworld')
    expect(
      render('{{i}} {{j}}', {
        i: 'hello',
        j: 'world'
      })
    ).to.equal('hello world')
    expect(
      render('{{i}} {{j}} {{k}}', {
        i: 'hello',
        j: 'world'
      })
    ).to.equal('hello world ')
    expect(
      render('{{var1}} {{var2}}', {
        var1: 'hello',
        var2: 'world'
      })
    ).to.equal('hello world')
  })

  it('interpolates all variables with empty string when view is empty', () => {
    expect(render('{{i}}', {})).to.equal('')
  })

  it('interpolates all variables with empty string when view is missing', () => {
    expect(render('{{i}}{{j}}')).to.equal('')
    expect(render('{{i}} {{j}}')).to.equal(' ')
    expect(render(' {{abc}} {{def}} ')).to.equal('   ')
  })

  it('allows $ as a value', () => {
    expect(
      render('{{a}}', {
        a: '$'
      })
    ).to.equal('$')
    expect(
      render('{{a}}', {
        a: ' $'
      })
    ).to.equal(' $')
    expect(
      render('{{a}}', {
        a: '$ '
      })
    ).to.equal('$ ')
    expect(
      render('{{a}}', {
        a: '$$'
      })
    ).to.equal('$$')
    expect(
      render('{{a}}', {
        a: '$&'
      })
    ).to.equal('$&')
    expect(
      render('{{a}}', {
        a: '$`'
      })
    ).to.equal('$`')
    expect(
      render('{{a}}', {
        a: "$'"
      })
    ).to.equal("$'")
    expect(
      render('{{a}}', {
        a: '$1'
      })
    ).to.equal('$1')
  })

  it('deals with boolean values properly', () => {
    expect(
      render('{{a}}', {
        a: true
      })
    ).to.equal('true')
    expect(
      render('{{a}}', {
        a: false
      })
    ).to.equal('false')
  })

  it('deals with numerical values properly', () => {
    expect(
      render('{{a}}', {
        a: 0
      })
    ).to.equal('0')
    expect(
      render('{{a}}', {
        a: 1
      })
    ).to.equal('1')
    expect(
      render('{{a}}', {
        a: 999
      })
    ).to.equal('999')
    expect(
      render('{{a}}', {
        a: Number.NaN
      })
    ).to.equal('NaN')
  })

  it('ignores null or undefined values properly', () => {
    expect(
      render('a{{b}}c', {
        b: null
      })
    ).to.equal('ac')
    expect(
      render('a{{b}}c', {
        b: undefined
      })
    ).to.equal('ac')
  })

  it('returns JSON.strinfigy(value) if it is an object', () => {
    expect(
      render('a{{b}}c', {
        b: {}
      })
    ).to.equal('a{}c')
    expect(
      render('a{{b}}c', {
        b: { x: 2 }
      })
    ).to.equal('a{"x":2}c')
    expect(
      render('-{{a.b}}-', {
        a: { b: { x: 2 } }
      })
    ).to.equal('-{"x":2}-')
  })

  it('ignores a variable name with space in it', () => {
    expect(
      render('{{a b}}', {
        a: 1,
        b: 2,
        ab: 3
      })
    ).to.equal('')
  })

  it('can handle spaces before and after variable names', () => {
    expect(
      render('-{{ a}}-{{b }}-{{ cc }}-', {
        a: '1',
        b: true,
        cc: 33
      })
    ).to.equal('-1-true-33-')
  })

  it('multiple occurances of the variable', () => {
    expect(
      render('{{a}}{{a}}{{a}}', {
        a: 'hello'
      })
    ).to.equal('hellohellohello')
    expect(
      render('{{a}}{{b}}{{a}}{{b}}', {
        a: '1',
        b: '2'
      })
    ).to.equal('1212')
  })

  it('can access array elements', () => {
    expect(
      render('I like {{0}}, {{1}} and {{2}}', ['orange', 'apple', 'lemon'])
    ).to.equal('I like orange, apple and lemon')
  })

  it('can access array length', () => {
    expect(render('{{length}}', [])).to.equal('0')
  })

  it('accepts a function as view', () => {
    // tslint:disable-next-line no-empty
    function view() {}
    view.A = 'Cat'
    expect(render('X={{A}}', view)).to.equal('X=Cat')
  })

  it('accepts class as view', () => {
    class Parent {
      constructor(public B = 'Mobile') {}
    }
    // tslint:disable-next-line max-classes-per-file
    class View extends Parent {
      constructor(public A = 'Crocodile') {
        super()
      }
    }
    const view = new View()
    // @ts-ignore
    view.C = 'Alice'
    expect(render('{{A}} or {{B}} and {{C}}', view)).to.equal(
      'Crocodile or Mobile and Alice'
    )
  })

  it('can access nested objects', () => {
    expect(
      render('{{a}} {{b.c}}', {
        a: 'hello',
        b: {
          c: 'world'
        }
      })
    ).to.equal('hello world')
    expect(
      render('{{a}}{{b.c}}', {
        a: 1,
        b: {
          c: 2
        }
      })
    ).to.equal('12')
  })

  it('can access nested objects with three level nesting', () => {
    expect(
      render('{{a}}{{b.c.d}}', {
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
      render('{{a.b.c.d.e.f}}', {
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
      render('{{a.b.c.d.e.f}}', {
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
      render('{{a}}-{{b.1}}', {
        a: 'a',
        b: [10, 11]
      })
    ).to.equal('a-11')
  })

  it('can access objects in an array', () => {
    expect(
      render('{{a.1.b.c}}', {
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

  it('does not crash when JSON conversion has a problem', () => {
    // An object with loop will cause a JSON.stringify() exception
    const viewObject = {}
    // @ts-ignore
    viewObject.a = viewObject
    expect(() => {
      JSON.stringify(viewObject)
    }).to.throw()
    expect(render('-{{a}}-', viewObject)).to.equal('-{...}-')
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
      render(
        '{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, ' +
          '{{children.1.first}} and {{children.2.first}}',
        singer
      )
    ).to.equal(
      'Michael Jackson had 3 children: Paris-Michael, Prince and Michael'
    )
  })

  describe('custom resolver', () => {
    it('is called for every variable name interpolation', () => {
      let counter = 0
      const viewVarNames = {
        a: false,
        b: false,
        c: false
      }
      const resolver: Resolver = (varName, scope: {}, token: NameToken) => {
        counter++
        // @ts-ignore
        viewVarNames[varName] = true
        // @ts-ignore
        return scope[varName]
      }
      const view = {
        a: 1,
        b: 2,
        c: 3
      }
      expect(render('{{a}} {{b}} {{c}}', view, { resolver })).to.equal('1 2 3')
      expect(counter).to.equal(3)
      expect(viewVarNames).to.deep.equal({ a: true, b: true, c: true })
    })

    it('does not call the default resolver if the custom resolver returns a value', () => {
      // tslint:disable-next-line no-shadowed-variable
      const resolver: Resolver = varName => {
        expect(varName).to.equal('a.b.c')
        return 'brick'
      }
      const view = {
        a: {
          b: {
            c: 3
          }
        }
      }
      expect(render('Hi {{a.b.c}}!', view, { resolver })).to.equal('Hi brick!')
    })

    it('can return an object', () => {
      const resolver: Resolver = () => {
        return { a: 2 }
      }
      expect(render('Hi {{whatever}}!', {}, { resolver })).to.equal(
        'Hi {"a":2}!'
      )
    })

    it('can be present without any view', () => {
      const resolver: Resolver = () => {
        return 'world'
      }
      expect(render('Hello {{target}}!', undefined, { resolver })).to.equal(
        'Hello world!'
      )
    })

    it('is called for nested variable names', () => {
      const view = {
        a: {
          b: {
            c: 'goodbye'
          }
        }
      }
      const resolver: Resolver = (varName, scope: {}) => {
        expect(scope).to.equal(view)
        expect(varName).to.equal('a.b.c')
        return 'world'
      }
      expect(render('Hello {{a.b.c}}!', view, { resolver })).to.equal(
        'Hello world!'
      )
    })

    it('gets the trimmed variable name', () => {
      const resolver: Resolver = varName => {
        return varName === 'a.b.c'
      }
      expect(
        render('{{ a.b.c}} {{ a.b.c }} {{a.b.c }}', undefined, { resolver })
      ).to.equal('true true true')
    })
  })
})

const { expect }= require('chai');
const render = require('./render');

describe('#render()', () => {
  it('is a function', () => {
    expect(render).to.be.a('function');
  });

  it('should not touch non-string templates', () => {
    expect(render(1)).to.equal(1);
    expect(render(null, {})).to.equal(null);
    expect(render(true, {})).to.equal(true);
  });

  it('returns an empty string if the template is empty', () => {
    expect(render('', {})).to.equal('');
    expect(render('', {
      a: 'b'
    })).to.equal('');
  });

  it('assumes empty value if the key does not exist', () => {
    expect(render('{{i}}', {})).to.equal('');
  });

  it('assumes empty value if the key is missing', () => {
    expect(render('{{i}}', {
      j: 1
    })).to.equal('');
  });

  it('can replace a single variable', () => {
    expect(render('{{i}}', {
      i: 'hello'
    })).to.equal('hello');
    expect(render('{{i}} world', {
      i: 'hello'
    })).to.equal('hello world');
    expect(render('Ohoy! {{i}}', {
      i: 'hello'
    })).to.equal('Ohoy! hello');
    expect(render('Ohoy! {{i}} world', {
      i: 'hello'
    })).to.equal('Ohoy! hello world');
  });

  it('can replace two variables', () => {
    expect(render('{{i}}{{j}}', {
      i: 'hello',
      j: 'world'
    })).to.equal('helloworld');
    expect(render('{{i}} {{j}}', {
      i: 'hello',
      j: 'world'
    })).to.equal('hello world');
    expect(render('{{i}} {{j}} {{k}}', {
      i: 'hello',
      j: 'world'
    })).to.equal('hello world ');
    expect(render('{{var1}} {{var2}}', {
      var1: 'hello',
      var2: 'world'
    })).to.equal('hello world');
  });

  it('interpolates all variables with empty string when view is invalid', () => {
    expect(render('{{i}}', undefined)).to.equal('');
    expect(render('{{i}}', null)).to.equal('');
    expect(render('{{i}}', 'hellow!!!')).to.equal('');
    expect(render('{{i}}', 13)).to.equal('');
    expect(render('{{i}}', true)).to.equal('');
  });

  it('interpolates all variables with empty string when view is empty', () => {
    expect(render('{{i}}', {})).to.equal('');
  });

  it('interpolates all variables with empty string when view is missing', () => {
    expect(render('{{i}}{{j}}')).to.equal('');
    expect(render('{{i}} {{j}}')).to.equal(' ');
    expect(render(' {{abc}} {{def}} ')).to.equal('   ');
  });

  it('allows $ as a value', () => {
    expect(render('{{a}}', {
      a: '$'
    })).to.equal('$');
    expect(render('{{a}}', {
      a: ' $'
    })).to.equal(' $');
    expect(render('{{a}}', {
      a: '$ '
    })).to.equal('$ ');
    expect(render('{{a}}', {
      a: '$$'
    })).to.equal('$$');
    expect(render('{{a}}', {
      a: '$&'
    })).to.equal('$&');
    expect(render('{{a}}', {
      a: '$`'
    })).to.equal('$`');
    expect(render('{{a}}', {
      a: '$\''
    })).to.equal('$\'');
    expect(render('{{a}}', {
      a: '$1'
    })).to.equal('$1');
  });

  it('deals with boolean values properly', () => {
    expect(render('{{a}}', {
      a: true
    })).to.equal('true');
    expect(render('{{a}}', {
      a: false
    })).to.equal('false');
  });

  it('deals with numerical values properly', () => {
    expect(render('{{a}}', {
      a: 0
    })).to.equal('0');
    expect(render('{{a}}', {
      a: 1
    })).to.equal('1');
    expect(render('{{a}}', {
      a: 999
    })).to.equal('999');
    expect(render('{{a}}', {
      a: Number.NaN
    })).to.equal('NaN');
  });

  it('ignores null or undefined values properly', () => {
    expect(render('a{{b}}c', {
      b: null
    })).to.equal('ac');
    expect(render('a{{b}}c', {
      b: undefined
    })).to.equal('ac');
  });

  it('returns JSON.strinfigy(value) if it is an object', () => {
    expect(render('a{{b}}c', {
      b: {}
    })).to.equal('a{}c');
    expect(render('a{{b}}c', {
      b: { x: 2 }
    })).to.equal('a{"x":2}c');
    expect(render('-{{a.b}}-', {
      a: { b: { x: 2 } }
    })).to.equal('-{"x":2}-');
  });

  it('ignores a variable name with space in it', () => {
    expect(render('{{a b}}', {
      a: 1,
      b: 2,
      ab: 3
    })).to.equal('');
  });

  it('can handle spaces before and after variable names', () => {
    expect(render('-{{ a}}-{{b }}-{{ cc }}-', {
      a: '1',
      b: true,
      cc: 33
    })).to.equal('-1-true-33-');
  });

  it('multiple occurances of the variable', () => {
    expect(render('{{a}}{{a}}{{a}}', {
      'a': 'hello'
    })).to.equal('hellohellohello');
    expect(render(
      '{{a}}{{b}}{{a}}{{b}}', {
        'a': '1',
        'b': '2'
      })).to.equal('1212');
  });

  it('can accesses array elements', () => {
    expect(render(
      'I like {{0}}, {{1}} and {{2}}', [
        'orange', 'apple', 'lemon'
      ])).to.equal('I like orange, apple and lemon');

    expect(render('{{length}}', [])).to.equal('0');
  });

  it('ignores the view if it is a function', function () {
    function view() {}
    view.A = 'Cat';
    expect(render('X={{A}}', view)).to.equal('X=');
  });

  it('accepts class as view', function () {
    class Parent {
      constructor () {
        this.B = 'Mobile';
      }
    }
    class View extends Parent {
      constructor () {
        super();
        this.A = 'Crocodile';
      }
    }
    const view = new View();
    view.C = 'Alice';
    expect(render('{{A}} or {{B}} and {{C}}', view)).to.equal('Crocodile or Mobile and Alice');
  });

  it('can access nested objects', function() {
    expect(render('{{a}} {{b.c}}', {
      a: 'hello',
      b: {
        c: 'world'
      }
    })).to.equal('hello world');
    expect(render('{{a}}{{b.c}}', {
      a: 1,
      b: {
        c: 2
      }
    })).to.equal('12');
  });

  it('can access nested objects with three level nesting', function() {
    expect(render('{{a}}{{b.c.d}}', {
      a: 1,
      b: {
        c: {
          d: 3
        }
      }
    })).to.equal('13');
  });

  it('can access nested objects with six level nesting', function() {
    expect(render('{{a.b.c.d.e.f}}', {
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
    })).to.equal('finally!');
  });

  it('if one of the nested keys do not exist, it is assumed empty string', function() {
    expect(render('{{a.b.c.d.e.f}}', {
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
    })).to.equal('');
  });

  it('can access nested objects with array index', function() {
    expect(render('{{a}}-{{b.1}}', {
      a: 'a',
      b: [10, 11]
    })).to.equal('a-11');
  });

  it('can access objects in an array', function () {
    expect(render('{{a.1.b.c}}', {
      a: [
        {
          b: { c: 11 }
        }, {
          b: { c: 13 }
        }
      ]
    })).to.equal('13');
  });

  it('does not crash when JSON conversion has a problem', function () {
    // An object with loop will cause a JSON.stringify() exception
    const viewObject = {};
    viewObject.a = viewObject;
    expect(function () {
      JSON.stringify(viewObject);
    }).to.throw();
    expect(render('-{{a}}-', viewObject)).to.equal('-{...}-');
  });

  it('works for Michael Jackson, so it should work for everyone', function () {
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
          prefix: 'II'
        },
        {
          first: 'Michael',
          middle: 'Joseph',
          prefix: 'Jr.'
        }
      ]
    };
    expect(render('{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, ' +
        '{{children.1.first}} and {{children.2.first}}',
    singer)).to.equal('Michael Jackson had 3 children: Paris-Michael, Prince and Michael');
  });

  describe('custom resolver', () => {
    it('is called for every variable name interpolation', () => {
      let counter = 0;
      const viewVarNames = {
        a: false,
        b: false,
        c: false
      };
      function resolver(view, varName) {
        counter++;
        viewVarNames[varName] = true;
        return view[varName];
      }
      const view = {
        a: 1,
        b: 2,
        c: 3
      };
      expect(render('{{a}} {{b}} {{c}}', view, { resolver })).to.equal('1 2 3');
      expect(counter).to.equal(3);
      expect(viewVarNames).to.deep.equal({ a: true, b: true, c: true });
    });

    it('does not call the default resolver if it resolves a value', () => {
      function resolver(view, varName) {
        expect(varName).to.equal('a.b.c');
        return 'brick';
      }
      const view = {
        a: {
          b: {
            c: 3
          }
        }
      };
      expect(render('Hi {{a.b.c}}!', view, { resolver })).to.equal('Hi brick!');
    });

    it('can return an object', () => {
      function resolver() {
        return { a: 2 };
      }
      expect(render('Hi {{whatever}}!', {}, { resolver })).to.equal('Hi {"a":2}!');
    });

    it('can be present without any view', () => {
      function resolver() {
        return 'world';
      }
      expect(render('Hello {{target}}!', undefined, { resolver })).to.equal('Hello world!');
    });

    it('is called even for an empty variable name', () => {
      function resolver(view, varName) {
        expect(varName).to.equal('');
        return 'world';
      }
      expect(render('Hello {{}}!', {}, { resolver })).to.equal('Hello world!');
    });

    it('is called for nested variable names', () => {
      const view = {
        a: {
          b: {
            c: 'goodbye'
          }
        }
      };
      function resolver(scope, varName) {
        expect(scope).to.equal(view);
        expect(varName).to.equal('a.b.c');
        return 'world';
      }
      expect(render('Hello {{a.b.c}}!', view, { resolver })).to.equal('Hello world!');
    });

    it('gets the trimmed variable name', () => {
      const resolver = (view, varName) => varName === 'a.b.c';
      expect(render('{{ a.b.c}} {{ a.b.c }} {{a.b.c }}', undefined, { resolver }))
        .to.equal('true true true');
    });
  });

});

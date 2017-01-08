const { expect }= require('chai');
const render = require('../../lib/render');

describe('#render() custom resolver', () => {
  it('is called for every variable name interpolation', () => {
    let counter = 0;
    const viewVarNames = {
      a: false,
      b: false,
      c: false
    };
    function customResolver(varName, view) {
      counter++;
      viewVarNames[varName] = true;
      return view[varName];
    }
    const view = {
      a: 1,
      b: 2,
      c: 3
    };
    expect(render('{{a}} {{b}} {{c}}', view, customResolver)).to.equal('1 2 3');
    expect(counter).to.equal(3);
    expect(viewVarNames).to.deep.equal({ a: true, b: true, c: true });
  });

  it('if it throws, the default resolve behaviour is used', () => {
    const customResolver = () => {
      throw new Error('do your best buddy');
    };
    const view = {
      a: 1,
      b: {
        c: 3
      }
    };
    expect(render('{{a}} {{b}} {{b.c}}', view, customResolver)).to.equal('1 {"c":3} 3');
  });

  it('if it resolves a value, the default resolver is not called', () => {
    function customResolver(varName) {
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
    expect(render('Hi {{a.b.c}}!', view, customResolver)).to.equal('Hi brick!');
  });

  it('can return an object', () => {
    function customResolver() {
      return { a: 2 };
    }
    expect(render('Hi {{whatever}}!', {}, customResolver)).to.equal('Hi {"a":2}!');
  });

  it('can be present without any view', () => {
    function customResolver() {
      return 'world';
    }
    expect(render('Hello {{target}}!', undefined, customResolver)).to.equal('Hello world!');
  });

  it('is called even for an empty variable name', () => {
    function customResolver(varName) {
      expect(varName).to.equal('');
      return 'world';
    }
    expect(render('Hello {{}}!', {}, customResolver)).to.equal('Hello world!');
  });

  it('is called for nested variable names', () => {
    const view = {
      a: {
        b: {
          c: 'goodbye'
        }
      }
    };
    function customResolver(varName, scope) {
      expect(scope).to.equal(view);
      expect(varName).to.equal('a.b.c');
      return 'world';
    }
    expect(render('Hello {{a.b.c}}!', view, customResolver)).to.equal('Hello world!');
  });

  it('gets the trimmed variable name', () => {
    const customResolver = varName => varName === 'a.b.c';
    expect(render('{{ a.b.c}} {{ a.b.c }} {{a.b.c }}', undefined, customResolver))
        .to.equal('true true true');
  });
});

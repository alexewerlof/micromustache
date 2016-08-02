const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');
const render = micromustache.render;
const compile = micromustache.compile;

describe('generalValueFn parameter', function () {

  it('is called for every tag interpolation', function() {
    var counter = 0;
    var viewVarNames = {
      a: false,
      b: false,
      c: false
    }
    function generalValueFn(view, varName) {
      counter++;
      viewVarNames[varName] = true;
      return view[varName];
    }
    var view = {
      a: 1,
      b: 2,
      c: 3
    };
    assert.deepEqual(render('{{a}} {{b}} {{c}}', view, generalValueFn), '1 2 3');
    assert.deepEqual(counter, 3);
    assert.deepEqual(viewVarNames, {a: true, b: true, c: true});
  });

  it('if returns undefined, the default resolve behaviour is used', function() {
    function generalValueFn(view, varName) {
      return;
    }
    var view = {
      a: 1,
      b: {
        c: 3
      }
    };
    assert.deepEqual(render('{{a}} {{b}} {{b.c}}', view, generalValueFn), '1 {"c":3} 3');
  });

  it('if it resolves a value, the default behaviour is cancelled', function () {
    function generalValueFn(view, varName) {
      assert.deepEqual(varName, 'a.b.c');
      return 'brick';
    }
    var view = {
      a: {
        b: {
          c: 3
        }
      }
    };
    assert.deepEqual(render('Hi {{a.b.c}}!', view, generalValueFn), 'Hi brick!');
  });

  it('can return an object', function () {
    function generalValueFn(view, varName) {
      return {a: 2};
    }
    assert.deepEqual(render('Hi {{whatever}}!', {}, generalValueFn), 'Hi {"a":2}!');
  });

  it('can be present without any view', function () {
    function generalValueFn(view, varName) {
      return 'world';
    }
    assert.deepEqual(render('Hello {{target}}!', generalValueFn), 'Hello world!');
  });

  it('is called even for an empty variable name', function () {
    function generalValueFn(view, varName) {
      assert.deepEqual(varName, '');
      return 'world';
    }
    assert.deepEqual(render('Hello {{}}!', {}, generalValueFn), 'Hello world!');
  });

  it('is not required for the compiler function', function () {
    function generalValueFn(view, varName) {
      return varName + ' ' + view[varName];
    }
    var compiler = compile('Hello {{what}}?', generalValueFn);
    assert.deepEqual(compiler({what: 'world'}), 'Hello what world?');
    assert.deepEqual(compiler({what: 'universe'}), 'Hello what universe?');
  });
});

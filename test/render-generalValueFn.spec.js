const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');
const render = micromustache.render;
const compile = micromustache.compile;

describe('generalValueFn parameter', function () {
  it('is called for every tag interpolation', function() {
    var counter = 0;
    function generalValueFn(view, varName) {
      counter++;
      return view[varName];
    }
    var view = {
      a: 1,
      b: 2,
      c: 3
    };
    assert.deepEqual(render('{{a}} {{b}} {{c}}', view, generalValueFn), '1 2 3');
    assert.deepEqual(counter, 3);
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

  it('is not required for the compiler function', function () {
    function generalValueFn(view, varName) {
      return varName + ' ' + view[varName];
    }
    var compiler = compile('Hello {{what}}?', generalValueFn);
    assert.deepEqual(compiler({what: 'world'}), 'Hello what world?');
    assert.deepEqual(compiler({what: 'universe'}), 'Hello what universe?');
  });
});

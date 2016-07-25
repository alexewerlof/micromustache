const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');
const compile = micromustache.compile;

describe('#compile()', function() {
  it('is a function', function () {
    assert.isFunction(micromustache.compile);
    assert.isFunction(compile);
  });
  it('compiles a template', function() {
    var compiled = compile('Hello {{name}}!');
    assert.deepEqual(typeof compiled, 'function');
    assert.deepEqual(compiled({
      name: 'Alex'
    }), 'Hello Alex!');
    assert.deepEqual(compiled({
      family: 'Alex'
    }), 'Hello !');
  });

  it('Compiles an empty template', function() {
    var compiler = compile('');
    assert.deepEqual(typeof compiler, 'function');
    assert.deepEqual(compiler({
      a: 2
    }), '');
  });
});

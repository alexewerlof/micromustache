const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');
const render = micromustache.render;

describe('#render()', function() {

  it('is a function', function() {
    assert.isFunction(micromustache.render);
    assert.isFunction(render);
  });

  it('should not touch non-string templates', function() {
    assert.deepEqual(render(1), 1);
    assert.deepEqual(render(null, {}), null);
    assert.deepEqual(render(true, {}), true);
  });

  it('returns an empty string if the template is empty', function() {
    assert.deepEqual(render('', {}), '');
    assert.deepEqual(render('', {
      a: 'b'
    }), '');
  });

  it('assumes empty value if the key does not exist', function() {
      assert.deepEqual(render('{{i}}', {}), '');
    });

  it('assumes empty value if the key is missing', function() {
    assert.deepEqual(render('{{i}}', {
      j: 1
    }), '');
  });

  it('can replace a single variable', function() {
    assert.deepEqual(render('{{i}}', {
      i: 'hello'
    }), 'hello');
    assert.deepEqual(render('{{i}} world', {
      i: 'hello'
    }), 'hello world');
    assert.deepEqual(render('Ohoy! {{i}}', {
      i: 'hello'
    }), 'Ohoy! hello');
    assert.deepEqual(render('Ohoy! {{i}} world', {
      i: 'hello'
    }), 'Ohoy! hello world');
  });

  it('can replace two variables', function() {
    assert.deepEqual(render('{{i}}{{j}}', {
      i: 'hello',
      j: 'world'
    }), 'helloworld');
    assert.deepEqual(render('{{i}} {{j}}', {
      i: 'hello',
      j: 'world'
    }), 'hello world');
    assert.deepEqual(render('{{i}} {{j}} {{k}}', {
      i: 'hello',
      j: 'world'
    }), 'hello world ');
    assert.deepEqual(render('{{var1}} {{var2}}', {
      var1: 'hello',
      var2: 'world'
    }), 'hello world');
  });

  it('interpolates all variables with empty string when view is invalid', function() {
    assert.deepEqual(render('{{i}}', undefined), '');
    assert.deepEqual(render('{{i}}', null), '');
    assert.deepEqual(render('{{i}}', 'hellow!!!'), '');
    assert.deepEqual(render('{{i}}', 13), '');
    assert.deepEqual(render('{{i}}', true), '');
  });

  it('interpolates all variables with empty string when view is empty', function() {
    assert.deepEqual(render('{{i}}', {}), '');
  });

  it('interpolates all variables with empty string when view is missing', function() {
    assert.deepEqual(render('{{i}}{{j}}'), '');
    assert.deepEqual(render('{{i}} {{j}}'), ' ');
    assert.deepEqual(render(' {{abc}} {{def}} '),'   ');
  });

  it('allows $ as a value', function() {
    assert.deepEqual(render('{{a}}', {
      a: '$'
    }), '$');
    assert.deepEqual(render('{{a}}', {
      a: ' $'
    }), ' $');
    assert.deepEqual(render('{{a}}', {
      a: '$ '
    }), '$ ');
    assert.deepEqual(render('{{a}}', {
      a: '$$'
    }), '$$');
    assert.deepEqual(render('{{a}}', {
      a: '$&'
    }), '$&');
    assert.deepEqual(render('{{a}}', {
      a: '$`'
    }), '$`');
    assert.deepEqual(render('{{a}}', {
      a: '$\''
    }), '$\'');
    assert.deepEqual(render('{{a}}', {
      a: '$1'
    }), '$1');
  });

  it('deals with boolean values properly', function() {
    assert.deepEqual(render('{{a}}', {
      a: true
    }), 'true');
    assert.deepEqual(render('{{a}}', {
      a: false
    }), 'false');
  });

  it('deals with numerical values properly', function() {
    assert.deepEqual(render('{{a}}', {
      a: 0
    }), '0');
    assert.deepEqual(render('{{a}}', {
      a: 1
    }), '1');
    assert.deepEqual(render('{{a}}', {
      a: 999
    }), '999');
    assert.deepEqual(render('{{a}}', {
      a: Number.NaN
    }), 'NaN');
  });

  it('ignores null or undefined values properly', function() {
    assert.deepEqual(render('a{{b}}c', {
      b: null
    }), 'ac');
    assert.deepEqual(render('a{{b}}c', {
      b: undefined
    }), 'ac');
  });

  it('returns JSON.strinfigy(value) if it is an object', function () {
    assert.deepEqual(render('a{{b}}c', {
      b: {}
    }), 'a{}c');
    assert.deepEqual(render('a{{b}}c', {
      b: {x: 2}
    }), 'a{"x":2}c');
    assert.deepEqual(render('-{{a.b}}-', {
      a: {b: {x: 2}}
    }), '-{"x":2}-');
  });

  it('ignores a variable name with space in it', function() {
    assert.deepEqual(render('{{a b}}', {
      a: 1,
      b: 2,
      ab: 3
    }), '');
  });

  it('can handle spaces before and after variable names', function() {
    assert.deepEqual(render('-{{ a}}-{{b }}-{{ cc }}-', {
      a: '1',
      b: true,
      cc: 33
    }), '-1-true-33-');
  });

  it('multiple occurances of the variable', function() {
    assert.deepEqual(render('{{a}}{{a}}{{a}}', {
      'a': 'hello'
    }), 'hellohellohello');
    assert.deepEqual(render(
      '{{a}}{{b}}{{a}}{{b}}', {
        'a': '1',
        'b': '2'
      }), '1212');
  });

  it('can accesses array elements', function() {
    assert.deepEqual(render(
      'I like {{0}}, {{1}} and {{2}}', [
        "orange", "apple", "lemon"
      ]), 'I like orange, apple and lemon');

    assert.deepEqual(render('{{length}}', []), '0');
  });

});

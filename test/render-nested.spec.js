const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');
const render = micromustache.render;

describe('#render() nested objects and arrays', function () {

  it('can access nested objects', function() {
    assert.deepEqual(render('{{a}} {{b.c}}', {
      a: 'hello',
      b: {
        c: 'world'
      }
    }), 'hello world');
    assert.deepEqual(render('{{a}}{{b.c}}', {
      a: 1,
      b: {
        c: 2
      }
    }), '12');
  });

  it('can access nested objects with three level nesting', function() {
    assert.deepEqual(render('{{a}}{{b.c.d}}', {
      a: 1,
      b: {
        c: {
          d: 3
        }
      }
    }), '13');
  });

  it('can access nested objects with six level nesting', function() {
    assert.deepEqual(render('{{a.b.c.d.e.f}}', {
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
    }), 'finally!');
  });

  it('if one of the nested keys do not exist, it is assumed empty string',
    function() {
      assert.deepEqual(render('{{a.b.c.d.e.f}}', {
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
      }), '');
    });

  it('can access nested objects with array index', function() {
    assert.deepEqual(render('{{a}}-{{b.1}}', {
      a: 'a',
      b: [10, 11]
    }), 'a-11');
  });

  it('can access objects in an array', function () {
    assert.deepEqual(render('{{a.1.b.c}}', {
      a: [{b: {c: 11}}, {b: {c: 13}}]
    }), '13')
  });

});

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

  it('does not crash when JSON conversion has a problem', function () {
    // An object with loop will cause a JSON exception
    var viewObject = {}
    viewObject.a = viewObject;
    assert.throws(function () {
      JSON.stringify(viewObject);
    });
    assert.deepEqual(render('-{{a}}-', viewObject), '-{...}-');
  });

  it('works for Michael Jackson, so it should work for everyone', function () {
    // I don't have a thing with MJ. Just improvised and it stuck there!
    var singer = {
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
    }
    assert.deepEqual(render("{{first}} {{last}} had {{children.length}} children: {{children.0.first}}, {{children.1.first}} and {{children.2.first}}",
    singer), 'Michael Jackson had 3 children: Paris-Michael, Prince and Michael');
  });

});

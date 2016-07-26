const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');
const render = micromustache.render;

describe('#render()', function () {
  describe('when value is a function', function () {
    it('calls the function if the value is a function', function() {
      function stringProcessor(key) {
        return key.toLocaleUpperCase();
      }
      assert.deepEqual(render('{{a}}', {
        a: stringProcessor
      }), 'A');
      assert.deepEqual(render('{{a}} {{b}}', {
        a: stringProcessor,
        b: stringProcessor
      }), 'A B');
    });

    it('calls the function in the view context', function() {
      var view = {
        a: stringProcessor
      };

      function stringProcessor(key) {
        assert.deepEqual(this, view);
        return 'yes';
      }
      assert.deepEqual(render('{{a}}', view), 'yes');
    });

    it('calls the value function with current scope info', function () {
      var viewObject = {a: {b: {c: value}}};
      function value (varName, currentScope, path, pathIndex) {
        assert.deepEqual(this, viewObject);
        assert.deepEqual(currentScope, viewObject.a.b);
        assert.deepEqual(varName, 'c');
        assert.deepEqual(path, ['a', 'b', 'c']);
        assert.deepEqual(pathIndex, 2);
        return 'yes';
      }
      assert.deepEqual(render('{{a.b.c}}', viewObject), 'yes');
    });

    it('can handle objects coming from the value function', function () {
      var viewObject = {
        a: function () {
          return {b: 2};
        }
      }
      assert.deepEqual(render('{{a}}', viewObject), '{"b":2}');
    });

    it('can handle non-JSON-stringify-able objects coming from the value function', function () {
      var viewObject = {
        a: function () {
          var ret = {};
          // This object has a loop reference, therefore JSON.stringify() throws
          ret.a = ret;
          return ret;
        }
      }
      assert.deepEqual(render('{{a}}', viewObject), '{...}');
    });
  });
});

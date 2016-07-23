const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');

describe('micromustache', function() {
  describe('#render()', function() {
    it('should not touch non-string templates', function() {
      assert.deepEqual(micromustache.render(1), 1);
      assert.deepEqual(micromustache.render(null, {}), null);
      assert.deepEqual(micromustache.render(true, {}), true);
    });

    it('returns an empty string if the template is empty', function() {
      assert.deepEqual(micromustache.render('', {}), '');
      assert.deepEqual(micromustache.render('', {
        a: 'b'
      }), '');
    });

    it('assumes empty value if there are no key in the object',
      function() {
        assert.deepEqual(micromustache.render('{{i}}', {}), '');
      });

    it('assumes empty value if the key is missing', function() {
      assert.deepEqual(micromustache.render('{{i}}', {
        j: 1
      }), '');
    });

    it('Replace only one variable', function() {
      assert.deepEqual(micromustache.render('{{i}}', {
        i: 'hello'
      }), 'hello');
      assert.deepEqual(micromustache.render('{{i}} world', {
        i: 'hello'
      }), 'hello world');
      assert.deepEqual(micromustache.render('Ohoy! {{i}}', {
        i: 'hello'
      }), 'Ohoy! hello');
      assert.deepEqual(micromustache.render('Ohoy! {{i}} world', {
        i: 'hello'
      }), 'Ohoy! hello world');
    });

    it('Replace two variables', function() {
      assert.deepEqual(micromustache.render('{{i}}{{j}}', {
        i: 'hello',
        j: 'world'
      }), 'helloworld');
      assert.deepEqual(micromustache.render('{{i}} {{j}}', {
        i: 'hello',
        j: 'world'
      }), 'hello world');
      assert.deepEqual(micromustache.render('{{i}} {{j}} {{k}}', {
        i: 'hello',
        j: 'world'
      }), 'hello world ');
      assert.deepEqual(micromustache.render('{{var1}} {{var2}}', {
        var1: 'hello',
        var2: 'world'
      }), 'hello world');
    });

    it('An empty dictionary will just remove all variables', function() {
      assert.deepEqual(micromustache.render('{{i}}'), '');
      assert.deepEqual(micromustache.render('{{i}}{{j}}'), '');
      assert.deepEqual(micromustache.render('{{i}} {{j}}'), ' ');
      assert.deepEqual(micromustache.render(' {{abc}} {{def}} '),
        '   ');
    });

    it('Allows using $ as a value', function() {
      assert.deepEqual(micromustache.render('{{a}}', {
        a: '$'
      }), '$');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: ' $'
      }), ' $');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: '$ '
      }), '$ ');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: '$$'
      }), '$$');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: '$&'
      }), '$&');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: '$`'
      }), '$`');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: '$\''
      }), '$\'');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: '$1'
      }), '$1');
    });

    it('Calls the function if the value is a function', function() {
      assert.deepEqual(micromustache.render('{{a}}', {
        a: function() {
          return 'world';
        }
      }), 'world');
      assert.deepEqual(micromustache.render('{{var1}}', {
        var1: function(key) {
          return key.toLocaleUpperCase();
        }
      }), 'VAR1');
    });

    it('deals with boolean values properly', function() {
      assert.deepEqual(micromustache.render('{{a}}', {
        a: true
      }), 'true');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: false
      }), 'false');
    });

    it('deals with numerical values properly', function() {
      assert.deepEqual(micromustache.render('{{a}}', {
        a: 0
      }), '0');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: 1
      }), '1');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: 999
      }), '999');
      assert.deepEqual(micromustache.render('{{a}}', {
        a: Number.NaN
      }), 'NaN');
    });

    it('ignores object or null values', function() {
      assert.deepEqual(micromustache.render('a{{b}}c', {
        b: null
      }), 'ac');
      assert.deepEqual(micromustache.render('a{{b}}c', {
        b: {}
      }), 'ac');
      assert.deepEqual(micromustache.render('a{{b}}c', {
        b: {
          b: 'hi'
        }
      }), 'ac');
    });

    it('can handle more than one occurance of the variable in template',
      function() {
        assert.deepEqual(micromustache.render('{{a}}{{a}}{{a}}', {
          'a': 'hello'
        }), 'hellohellohello');
        assert.deepEqual(micromustache.render('{{a}}{{b}}{{a}}{{b}}', {
          'a': '1',
          'b': '2'
        }), '1212');
      });

    it('can accesses array elements', function() {
      assert.deepEqual(micromustache.render(
        'I like {{0}}, {{1}} and {{2}}', [
          "orange", "apple", "lemon"
        ]), 'I like orange, apple and lemon');

      assert.deepEqual(micromustache.render('{{length}}', []), '0');
    });
  });

  describe('#compile()', function() {
    it('compiles a template', function() {
      var compiled = micromustache.compile('Hello {{name}}!');
      assert.deepEqual(typeof compiled, 'function');
      assert.deepEqual(compiled({
        name: 'Alex'
      }), 'Hello Alex!');
      assert.deepEqual(compiled({
        family: 'Alex'
      }), 'Hello !');
    });

    it('Compiles an empty template', function() {
      var compile = micromustache.compile('');
      assert.deepEqual(typeof compile, 'function');
      assert.deepEqual(compile({
        a: 2
      }), '');
    });
  });

  describe('#to_html()', function() {
    it('has a to_html() function', function() {
      assert.isFunction(micromustache.to_html);
    });

    it('is exactly as render()', function() {
      assert.deepEqual(micromustache.to_html, micromustache.render);
    });
  });
});

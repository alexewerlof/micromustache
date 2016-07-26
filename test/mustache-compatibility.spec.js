const assert = require('chai').assert;
const Mustache = require('mustache');
const micromustache = require('../src/micromustache.js');

describe('mustache.js compatibility', function() {
  it('checks the existence of the supported functions', function() {
    assert.deepEqual(typeof micromustache, typeof Mustache);

    assert.deepEqual(typeof micromustache.render, typeof Mustache
      .render);

    assert.deepEqual(typeof micromustache.render('', {}), typeof Mustache
      .render('', {}));
  });

});

describe('just as MustacheJS', function() {
  var testCases = [{
    description: 'empty template',
    template: '',
    view: {}
  }, {
    description: 'empty value interpolation',
    template: '{{a}}',
    view: {
      a: ''
    }
  }, {
    description: 'numerical string value interpolation',
    template: '{{a}}',
    view: {
      a: '1'
    }
  }, {
    description: 'string value interpolation',
    template: '{{a}}',
    view: {
      a: 'a'
    }
  }, {
    description: 'numerical value interpolation',
    template: '{{a}}',
    view: {
      a: 11
    }
  }, {
    description: 'empty string interpolation',
    template: '{{a}}',
    view: {
      a: ' '
    }
  }, {
    description: 'space around variable in the template',
    template: ' {{a}} ',
    view: {
      a: ''
    }
  }, {
    description: 'space around variable and in the value',
    template: ' {{a}} ',
    view: {
      a: ' '
    }
  }, {
    description: 'two variables but one does not have a key/value',
    template: ' {{a}} {{b}} ',
    view: {
      a: ' '
    }
  }, {
    description: 'two values',
    template: ' {{a}} {{b}} ',
    view: {
      a: 'a',
      b: 'b'
    }
  }, {
    description: 'more than one interpolation',
    template: ' {{a}} {{a}} {{a}}',
    view: {
      a: 'a'
    }
  }, {
    description: 'more than one interpolation with a value of dash',
    template: ' {{a}} {{a}} {{a}}',
    view: {
      a: '-'
    }
  }, {
    description: 'numerical variable name',
    template: '{{1}}',
    view: {
      '1': '-'
    }
  }, {
    description: 'empty string as value name',
    template: '{{}}',
    view: {
      '': 'hello'
    }
  }, {
    description: 'a space as variable name',
    template: '{{ }}',
    view: {
      ' ': '-'
    }
  }, {
    description: 'a dash as variable name',
    template: '{{-}}',
    view: {
      '-': '-'
    }
  }, {
    description: 'an invalid javascript id as variable name',
    template: '{{1a}}',
    view: {
      '1a': '-'
    }
  }, {
    description: 'a null value',
    template: '{{a}}',
    view: {
      a: null
    }
  }, {
    description: 'a numerical and null value',
    template: '{{a}},{{b}}',
    view: {
      a: 123,
      b: null
    }
  }, {
    description: 'data object is empty (all keys missing)',
    template: '{{a}}',
    view: {}
  }, {
    description: 'boolean value',
    template: '{{a}}',
    view: {
      a: true
    }
  }, {
    description: 'boolean false value',
    template: '{{a}}',
    view: {
      a: false
    }
  }, {
    description: 'NaN value',
    template: '{{a}}',
    view: {
      a: Math.NaN
    }
  }, {
    description: 'POSITIVE_INFINITY value',
    template: '{{a}}',
    view: {
      a: Number.POSITIVE_INFINITY
    }
  }, {
    description: 'NEGATIVE_INFINITY value',
    template: '{{a}}',
    view: {
      a: Number.NEGATIVE_INFINITY
    }
  }, {
    description: 'a value of 0',
    template: '{{a}}',
    view: {
      a: 0
    }
  }, {
    description: 'a real numerical value',
    template: '{{a}}',
    view: {
      a: 0.1
    }
  }, {
    description: 'EPSILON value',
    template: '{{a}}',
    view: {
      a: Number.EPSILON
    }
  }, {
    description: '$ for variable name',
    template: '{{$}}',
    view: {
      '$': 'test'
    }
  }, {
    description: 'underline for variable name',
    template: '{{_}}',
    view: {
      '_': 'test'
    }
  }, {
    description: 'empty spaces for variable name',
    template: '{{    }}',
    view: {
      '_': 'test'
    }
  }, {
    description: 'empty spaces before variable name',
    template: '{{   a}}',
    view: {
      'a': 'test'
    }
  }, {
    description: 'empty spaces after variable name',
    template: '{{a   }}',
    view: {
      'a': 'test'
    }
  }, {
    description: 'empty spaces around the variable name',
    template: '{{   a   }}',
    view: {
      'a': 'test'
    }
  }, {
    description: '% as a variable name',
    template: '{{%}}',
    view: {
      '%': 'test'
    }
  }, {
    description: '"var" as a variable name',
    template: '{{var}}',
    view: {
      'var': 'test'
    }
  }, {
    description: 'a variable inside another variable',
    template: '{{a{{b}}c}}',
    view: {
      'a': 'a',
      'b': 'b',
      'c': 'c'
    }
  }, {
    description: 'keys are indexes to an array data object',
    template: 'I like {{0}}, {{1}} and {{2}}',
    view: ["orange", "apple", "lemon"]
  }];
  testCases.forEach(testCase => {
    it(`can handle ${testCase.description}`, () => {
      assert.deepEqual(
        micromustache.render(testCase.template, testCase.view),
        Mustache.render(testCase.template, testCase.view)
      );
    });
  });
});

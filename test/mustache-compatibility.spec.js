const { expect } = require('chai');
const Mustache = require('mustache');
const { render } = require('../index');

class ClassWithToString {
  toString() {
    return 'A constant string'
  }
}

const testCases = [
  {
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
    description: 'two variables but one is missing from the view',
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
    description: 'an empty data object (all keys missing)',
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
    description: '$ as variable name',
    template: '{{$}}',
    view: {
      '$': 'test'
    }
  }, {
    description: 'underline variable name',
    template: '{{_}}',
    view: {
      '_': 'test'
    }
  }, {
    description: 'empty spaces variable name',
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
    description: '"var" as variable name',
    template: '{{var}}',
    view: {
      'var': 'test'
    }
  }, {
    description: 'nested values',
    template: '{{foo.bar}}',
    view: {
      foo: {
        bar: 'baz'
      }
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
    description: 'keys as indexes to an array',
    template: 'I like {{0}}, {{1}} and {{2}}',
    view: ['orange', 'apple', 'lemon']
  }, {
    description: 'An object with toString()',
    template: '{{obj}}',
    view: {
      obj: new ClassWithToString
    }
  }
];

describe('MustacheJS compatibility', function () {
  testCases.forEach(testCase => {
    const { description, template, view } = testCase;
    it(`shows the same behaviour as mustache for ${description}`, () => {
      const micromustacheOutput = render(template, view);
      const mustacheOutput = Mustache.render(template, view);
      expect(micromustacheOutput).to.equal(mustacheOutput);
    });
  });
});

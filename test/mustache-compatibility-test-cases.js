class ClassWithToString {
  toString() {
    return 'A constant string'
  }
}

module.exports = [
  {
    description: 'empty template',
    template: '',
    scope: {}
  },
  {
    description: 'empty value interpolation',
    template: '{{a}}',
    scope: {
      a: ''
    }
  },
  {
    description: 'numerical string value interpolation',
    template: '{{a}}',
    scope: {
      a: '1'
    }
  },
  {
    description: 'string value interpolation',
    template: '{{a}}',
    scope: {
      a: 'a'
    }
  },
  {
    description: 'numerical value interpolation',
    template: '{{a}}',
    scope: {
      a: 11
    }
  },
  {
    description: 'empty string interpolation',
    template: '{{a}}',
    scope: {
      a: ' '
    }
  },
  {
    description: 'space around variable in the template',
    template: ' {{a}} ',
    scope: {
      a: ''
    }
  },
  {
    description: 'space around variable and in the value',
    template: ' {{a}} ',
    scope: {
      a: ' '
    }
  },
  {
    description: 'two variables but one is missing from the scope',
    template: ' {{a}} {{b}} ',
    scope: {
      a: ' '
    }
  },
  {
    description: 'two values',
    template: ' {{a}} {{b}} ',
    scope: {
      a: 'a',
      b: 'b'
    }
  },
  {
    description: 'more than one interpolation',
    template: ' {{a}} {{a}} {{a}}',
    scope: {
      a: 'a'
    }
  },
  {
    description: 'more than one interpolation with a value of dash',
    template: ' {{a}} {{a}} {{a}}',
    scope: {
      a: '-'
    }
  },
  {
    description: 'numerical variable name',
    template: '{{1}}',
    scope: {
      '1': '-'
    }
  },
  {
    description: 'empty string as value name',
    template: '{{}}',
    scope: {
      '': 'hello'
    }
  },
  {
    description: 'a space as variable name',
    template: '{{ }}',
    scope: {
      ' ': '-'
    }
  },
  {
    description: 'a dash as variable name',
    template: '{{-}}',
    scope: {
      '-': '-'
    }
  },
  {
    description: 'an invalid javascript id as variable name',
    template: '{{1a}}',
    scope: {
      '1a': '-'
    }
  },
  {
    description: 'a null value',
    template: '{{a}}',
    scope: {
      a: null
    }
  },
  {
    description: 'a numerical and null value',
    template: '{{a}},{{b}}',
    scope: {
      a: 123,
      b: null
    }
  },
  {
    description: 'an empty data object (all keys missing)',
    template: '{{a}}',
    scope: {}
  },
  {
    description: 'boolean value',
    template: '{{a}}',
    scope: {
      a: true
    }
  },
  {
    description: 'boolean false value',
    template: '{{a}}',
    scope: {
      a: false
    }
  },
  {
    description: 'NaN value',
    template: '{{a}}',
    scope: {
      a: Math.NaN
    }
  },
  {
    description: 'POSITIVE_INFINITY value',
    template: '{{a}}',
    scope: {
      a: Number.POSITIVE_INFINITY
    }
  },
  {
    description: 'NEGATIVE_INFINITY value',
    template: '{{a}}',
    scope: {
      a: Number.NEGATIVE_INFINITY
    }
  },
  {
    description: 'a value of 0',
    template: '{{a}}',
    scope: {
      a: 0
    }
  },
  {
    description: 'a real numerical value',
    template: '{{a}}',
    scope: {
      a: 0.1
    }
  },
  {
    description: 'EPSILON value',
    template: '{{a}}',
    scope: {
      a: Number.EPSILON
    }
  },
  {
    description: '$ as variable name',
    template: '{{$}}',
    scope: {
      $: 'test'
    }
  },
  {
    description: 'underline variable name',
    template: '{{_}}',
    scope: {
      _: 'test'
    }
  },
  {
    description: 'empty spaces variable name',
    template: '{{    }}',
    scope: {
      _: 'test'
    }
  },
  {
    description: 'empty spaces before variable name',
    template: '{{   a}}',
    scope: {
      a: 'test'
    }
  },
  {
    description: 'empty spaces after variable name',
    template: '{{a   }}',
    scope: {
      a: 'test'
    }
  },
  {
    description: 'empty spaces around the variable name',
    template: '{{   a   }}',
    scope: {
      a: 'test'
    }
  },
  {
    description: '% as a variable name',
    template: '{{%}}',
    scope: {
      '%': 'test'
    }
  },
  {
    description: '"var" as variable name',
    template: '{{var}}',
    scope: {
      var: 'test'
    }
  },
  {
    description: 'nested values',
    template: '{{foo.bar}}',
    scope: {
      foo: {
        bar: 'baz'
      }
    }
  },
  {
    description: 'a variable inside another variable',
    template: '{{a{{b}}c}}',
    scope: {
      a: 'a',
      b: 'b',
      c: 'c'
    }
  },
  {
    description: 'keys as indexes to an array',
    template: 'I like {{0}}, {{1}} and {{2}}',
    scope: ['orange', 'apple', 'lemon']
  },
  {
    description: 'An object with toString()',
    template: '{{obj}}',
    scope: {
      obj: new ClassWithToString()
    }
  }
]

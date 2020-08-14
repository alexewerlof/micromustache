import * as mustache from 'mustache'
import { Scope, render } from './index'

class ClassWithToString {
  public toString(): string {
    return 'Hello world'
  }
}

interface ITestCase {
  readonly description: string
  readonly template: string
  readonly scope: Scope
}

const testCases: ITestCase[] = [
  {
    description: 'empty template',
    template: '',
    scope: {},
  },
  {
    description: 'empty value interpolation',
    template: '{{a}}',
    scope: {
      a: '',
    },
  },
  {
    description: 'numerical string value interpolation',
    template: '{{a}}',
    scope: {
      a: '1',
    },
  },
  {
    description: 'string value interpolation',
    template: '{{a}}',
    scope: {
      a: 'a',
    },
  },
  {
    description: 'numerical value interpolation',
    template: '{{a}}',
    scope: {
      a: 11,
    },
  },
  {
    description: 'empty string interpolation',
    template: '{{a}}',
    scope: {
      a: ' ',
    },
  },
  {
    description: 'space around variable in the template',
    template: ' {{a}} ',
    scope: {
      a: '',
    },
  },
  {
    description: 'space around variable and in the value',
    template: ' {{a}} ',
    scope: {
      a: ' ',
    },
  },
  {
    description: 'two variables but one is missing from the scope',
    template: ' {{a}} {{b}} ',
    scope: {
      a: ' ',
    },
  },
  {
    description: 'two values',
    template: ' {{a}} {{b}} ',
    scope: {
      a: 'a',
      b: 'b',
    },
  },
  {
    description: 'more than one interpolation',
    template: ' {{a}} {{a}} {{a}}',
    scope: {
      a: 'a',
    },
  },
  {
    description: 'more than one interpolation with a value of dash',
    template: ' {{a}} {{a}} {{a}}',
    scope: {
      a: '-',
    },
  },
  {
    description: 'numerical path',
    template: '{{1}}',
    scope: {
      '1': '-',
    },
  },
  {
    description: 'an invalid javascript id as path',
    template: '{{1a}}',
    scope: {
      '1a': '-',
    },
  },
  {
    description: 'a null value',
    template: '{{a}}',
    scope: {
      a: null,
    },
  },
  {
    description: 'a numerical and null value',
    template: '{{a}},{{b}}',
    scope: {
      a: 123,
      b: null,
    },
  },
  {
    description: 'an empty data object (all keys missing)',
    template: '{{a}}',
    scope: {},
  },
  {
    description: 'boolean value',
    template: '{{a}}',
    scope: {
      a: true,
    },
  },
  {
    description: 'boolean false value',
    template: '{{a}}',
    scope: {
      a: false,
    },
  },
  {
    description: 'NaN value',
    template: '{{a}}',
    scope: {
      a: NaN,
    },
  },
  {
    description: 'POSITIVE_INFINITY value',
    template: '{{a}}',
    scope: {
      a: Number.POSITIVE_INFINITY,
    },
  },
  {
    description: 'NEGATIVE_INFINITY value',
    template: '{{a}}',
    scope: {
      a: Number.NEGATIVE_INFINITY,
    },
  },
  {
    description: 'a value of 0',
    template: '{{a}}',
    scope: {
      a: 0,
    },
  },
  {
    description: 'a real numerical value',
    template: '{{a}}',
    scope: {
      a: 0.1,
    },
  },
  {
    description: 'EPSILON value',
    template: '{{a}}',
    scope: {
      a: Number.EPSILON,
    },
  },
  {
    description: '$ as path',
    template: '{{$}}',
    scope: {
      $: 'test',
    },
  },
  {
    description: 'underline path',
    template: '{{_}}',
    scope: {
      _: 'test',
    },
  },
  {
    description: 'empty spaces before path',
    template: '{{   a}}',
    scope: {
      a: 'test',
    },
  },
  {
    description: 'empty spaces after path',
    template: '{{a   }}',
    scope: {
      a: 'test',
    },
  },
  {
    description: 'empty spaces around the path',
    template: '{{   a   }}',
    scope: {
      a: 'test',
    },
  },
  {
    description: '"var" as path',
    template: '{{var}}',
    scope: {
      var: 'test',
    },
  },
  {
    description: 'nested values',
    template: '{{foo.bar}}',
    scope: {
      foo: {
        bar: 'baz',
      },
    },
  },
  {
    description: 'keys as indexes to an array',
    template: 'I like {{0}}, {{1}} and {{2}}',
    scope: ['orange', 'apple', 'lemon'],
  },
  {
    description: 'An object with toString()',
    template: '{{obj}}',
    scope: {
      obj: new ClassWithToString(),
    },
  },
]

describe('MustacheJS compatibility', () => {
  testCases.forEach((testCase) => {
    const { description, template, scope } = testCase
    it(`shows the same behaviour as mustache for ${description}`, () => {
      const micromustacheOutput = render(template, scope)
      const mustacheOutput = mustache.render(template, scope)
      expect(micromustacheOutput).toBe(mustacheOutput)
    })
  })
})

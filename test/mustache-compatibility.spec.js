const { expect } = require('chai');
const Mustache = require('mustache');
const { render } = require('../index');
const testCases = require('./mustache-compatibility-test-cases');

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

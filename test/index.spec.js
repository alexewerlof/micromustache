const { expect } = require('chai');
const micromustache = require('../');
const compile = require('../lib/compile');
const render = require('../lib/render');

describe('micromustache', () => {
  it('exports render function', () => {
    expect(micromustache.render).to.be.a('function');
    expect(micromustache.render).to.equal(render);
  });

  it('exports compile function', () => {
    expect(micromustache.compile).to.be.a('function');
    expect(micromustache.compile).to.equal(compile);
  });
});

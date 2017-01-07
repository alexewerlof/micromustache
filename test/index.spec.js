const { expect } = require('chai');
const micromustache = require('../');

describe('micromustache', () => {
  it('exports render function', () => {
    expect(micromustache.render).to.be.a('function');
  });

  it('exports compile function', () => {
    expect(micromustache.compile).to.be.a('function');
  });
});

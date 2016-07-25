const assert = require('chai').assert;
const micromustache = require('../src/micromustache.js');

describe('#to_html()', function() {
  it('has a to_html() function', function() {
    assert.isFunction(micromustache.to_html);
  });

  it('is exactly as render()', function() {
    assert.deepEqual(micromustache.to_html, micromustache.render);
  });
});

const { expect }= require('chai');
const get = require('./get');

describe('#get()', () => {
  it('can resolve 1-level object', () => {
    const obj = {
      foo: 'bar',
      baz: 2
    };
    expect(get(obj, 'foo')).to.equal('bar');
    expect(get(obj, 'baz')).to.equal(2);
  });

  it('can resolve multi-level object', () => {
    const obj = {
      a: {
        b: {
          c: {
            foo: 'bar'
          }
        }
      }
    }
    expect(get(obj, 'a.b.c.foo')).to.equal('bar');
  });

  it('does not throw if it cannot resolve nested objects', () => {
    const obj = {
      foo: 'bar'
    }
    expect(() => get(obj, 'hello')).not.to.throw()
    expect(() => get(obj, 'hello.kitty')).not.to.throw()
  });

  it('can access array elements', () => {
    const arr = [ 'banana', 'apple', 'orange', 'pear'];
    expect(get(arr, '1')).to.equal('apple');
  });
});

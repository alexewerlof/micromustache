const { expect } = require('chai');
const compile = require('./compile');

describe('#compile()', () => {
  it('is a function', () => {
    expect(compile).to.be.a('function');
  });

  it('returns a function', () => {
    const compiler = compile('Hello {{name}}!');
    expect(compiler).to.be.a('function');
  });

  it('compiles a template', () => {
    const template = 'Hello {{name}}!';
    const view = { name: 'Alex' };
    const view2 = { foo: 'Alex' };
    const compiler = compile(template);
    expect(compiler(view)).to.equal('Hello Alex!');
    expect(compiler(view2)).to.equal('Hello !');
  });

  it('compiles an empty template', () => {
    const compiler = compile('');
    expect(compiler).to.be.a('function');
    expect(compiler({})).to.equal('');
  });
});

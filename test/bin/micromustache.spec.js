const { exec } = require('child_process');
const fs = require('fs');
const { expect } = require('chai');
// Use package json as a view file because it contains a json and is perfect for this test
const view = require('../../package.json');
const path = require('path');
const render = require('../../lib/render');

/* Note: to test if the binary script can be installed correctly, from the root of this repo call:
 * $ npm link
 * $ micromustache test/bin/template.txt package.json
 * $ npm unlink
 */

describe('micromustache binary', () => {
  const scriptPath = path.resolve(__dirname, '../../bin/micromustache');
  const templatePath = path.resolve(__dirname, 'template.txt');
  const viewPath = path.resolve(__dirname, '../../package.json');

  it('produces expected results for a valid template and view file', (done) => {
    const template = fs.readFileSync(templatePath, { encoding: 'utf8' });
    exec(`${scriptPath} ${templatePath} ${viewPath}`, (execErr, stdout) => {
      done();
      if (execErr) {
        throw execErr;
      }
      // Note: console redirection adds an \n to the end of the result
      expect(stdout).to.equal(`${render(template, view)}\n`);
    });
  });

  it('fils if templatePath is missing', (done) => {
    exec(`${scriptPath}`, (execErr) => {
      done();
      expect(execErr).not.to.be.null;
    });
  });

  it('fils if templatePath is pointing to an invalid file', (done) => {
    exec(`${scriptPath} .`, (execErr) => {
      done();
      expect(execErr).not.to.be.null;
    });
  });

  it('fils if viewPath is missing', (done) => {
    exec(`${scriptPath} ${templatePath}`, (execErr) => {
      done();
      expect(execErr).not.to.be.null;
    });
  });

  it('fils if viewPath is pointing to an invalid file', (done) => {
    exec(`${scriptPath} ${templatePath} .`, (execErr) => {
      done();
      expect(execErr).not.to.be.null;
    });
  });
});

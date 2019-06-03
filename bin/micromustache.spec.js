const { exec } = require('child_process')
const fs = require('fs')
const { expect } = require('chai')
// Use package json as a scope file because it contains a json and is perfect for this test
const scope = require('../package.json')
const path = require('path')
const render = require('../lib/render')

/* Note: to test if the binary script can be installed correctly, from the root of this repo call:
 * $ npm link
 * $ micromustache test/bin/template.txt package.json
 * $ npm unlink
 */

describe('micromustache binary', () => {
  const scriptPath = path.resolve(__dirname, 'micromustache')
  const templatePath = path.resolve(__dirname, 'template.spec.txt')
  const scopePath = path.resolve(__dirname, '../package.json')

  it('produces expected results for a valid template and scope file', done => {
    const template = fs.readFileSync(templatePath, { encoding: 'utf8' })
    exec(`${scriptPath} ${templatePath} ${scopePath}`, (execErr, stdout) => {
      done()
      if (execErr) {
        throw execErr
      }
      // Note: console redirection adds an \n to the end of the result
      expect(stdout).to.equal(`${render(template, scope)}\n`)
    })
  })

  it('fails if templatePath is missing', done => {
    exec(`${scriptPath}`, execErr => {
      done()
      expect(execErr).not.to.be.null
    })
  })

  it('fails if templatePath is pointing to an invalid file', done => {
    exec(`${scriptPath} .`, execErr => {
      done()
      expect(execErr).not.to.be.null
    })
  })

  it('fails if scopePath is missing', done => {
    exec(`${scriptPath} ${templatePath}`, execErr => {
      done()
      expect(execErr).not.to.be.null
    })
  })

  it('fails if scopePath is pointing to an invalid file', done => {
    exec(`${scriptPath} ${templatePath} .`, execErr => {
      done()
      expect(execErr).not.to.be.null
    })
  })
})

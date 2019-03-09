#!/usr/bin/env node

// tslint:disable-next-line no-var-requires
const fs = require('fs')
// tslint:disable-next-line no-var-requires
const { render } = require('../lib/')
const encoding = 'utf8'

// eslint-disable-next-line no-unused-vars
const [, scriptName, templatePath, scopePath] = process.argv

const syntax = `${scriptName} templatePath scopePath
Both parameters are required.
  templatePath: path to a template text file that contains {{varName}} in it
  scopePath: path to a valid json file
By default this script prints to console. You can redirect it to output file using '> outputPath'
Files are read/write with utf8 encoding.`

try {
  const template = fs.readFileSync(templatePath, { encoding })
  const scopeTxt = fs.readFileSync(scopePath, { encoding })
  const scope = JSON.parse(scopeTxt)
  // tslint:disable-next-line no-console
  console.log(render(template, scope))
} catch (e) {
  // tslint:disable-next-line no-console
  console.error(syntax)
  throw e
}

const am = require('am')
const assert = require('assert')
const { promises: { readdir, access } } = require('fs')
const { resolve, extname } = require('path')
const pkgJson = require('../package.json')

const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, './dist')

async function main() {
  const validFileExtentions = ['.mjs', '.js', '.cjs', '.map']
  for await(let file of await readdir(distDir, { withFileTypes: true })) {
    console.log(`Checking ${file.name}...`)
    // only inspect files
    if(file.isFile()) {
      // does not contain any unexpected file extension
      const fileExtension = extname(file.name)
      assert(validFileExtentions.includes(fileExtension))
      // Has the package name in its file name
      assert(file.name.includes(pkgJson.name))
    }
  }
  // pkg-ok checks "package.json:main", "package.json:module" and "package.json:types"
}

am(main)

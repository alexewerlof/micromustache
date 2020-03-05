module.exports = {
  hideGenerator: true,
  tsconfig: './tsconfig-docs.json',
  module: 'commonjs',
  excludeNotExported: true,
  excludePrivate: true,
  mode: 'file',
  out: 'docs',
  theme: 'minimal',
}

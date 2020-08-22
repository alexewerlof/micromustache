module.exports = {
  hideGenerator: true,
  tsconfig: './tsconfig.json',
  module: 'commonjs',
  excludeNotExported: true,
  excludePrivate: true,
  includeVersion: true,
  stripInternal: true,
  mode: 'file',
  out: 'docs',
  theme: 'minimal',
}

const { name, version } = require('./package.json')

module.exports = {
    name: `${name} v${version}`,
    hideGenerator: true,
    tsconfig: './tsconfig.json',
    module: 'commonjs',
    excludeNotExported: true,
    excludePrivate: true,
    stripInternal: true,
    mode: 'file',
    out: 'docs',
    theme: 'minimal',
}

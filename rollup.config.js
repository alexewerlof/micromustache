import { terser } from 'rollup-plugin-terser'
import gzipPlugin from 'rollup-plugin-gzip'
import typescript from 'rollup-plugin-typescript'
import { name, version } from './package.json'

const banner = `/* ${name} v${version} */`
const sourcemap = true

export default [
    {
        input: 'src/index.ts',
        plugins: [
            typescript({
                target: 'es5',
                module: 'es6',
                lib: ['es2015'],
            }),
            terser({
                include: /\.min\.$/,
                safari10: true,
            }),
            gzipPlugin()
        ],
        output: [
            {
                file: `dist/${name}.cjs`,
                format: 'cjs',
                banner,
                sourcemap,
            },
            {
                file: 'dist/umd.js',
                name,
                format: 'umd',
                banner,
                sourcemap,
            },
            {
                file: `dist/${name}.mjs`,
                format: 'esm',
                banner,
                sourcemap,
            },
            {
                file: `dist/${name}.min.mjs`,
                format: 'esm',
                banner,
                sourcemap,
            },
        ]
    }
]

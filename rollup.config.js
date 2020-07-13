import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { name, version } from './package.json'

/*
typescript and tslib are peer dependencies of @rollup/plugin-typescript
*/
const banner = `/* ${name} v${version} */`
const sourcemap = true

export default [
  {
    input: 'src/index.ts',
    plugins: [
      typescript({
        // These options are what you would pass to compilerOptions
        tsconfig: './tsconfig-build.json',
      }),
      terser({
        include: /\.min\.$/,
        safari10: true,
      }),
    ],
    output: [
      {
        file: `dist/${name}.js`,
        format: 'cjs',
        banner,
        sourcemap,
      },
      {
        file: `dist/${name}.umd.js`,
        name,
        format: 'umd',
        banner,
        sourcemap,
      },
      {
        file: `dist/${name}.umd.min.js`,
        name,
        format: 'umd',
        banner,
        sourcemap,
      },
      {
        file: `dist/${name}.mjs`,
        format: 'es',
        banner,
        sourcemap,
      },
      {
        file: `dist/${name}.min.mjs`,
        format: 'es',
        banner,
        sourcemap,
      },
    ],
  },
]

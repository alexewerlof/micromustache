import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { name, version } from './package.json'

if (typeof name !== 'string' || typeof version !== 'string') {
  console.log('Invalid name or version')
  process.exit()
}

/*
typescript and tslib are peer dependencies of @rollup/plugin-typescript
*/
const commonConfig = {
  banner: `/* ${name} v${version} */`,
  sourcemap: true,
}

export default [
  {
    input: 'src/index.ts',
    plugins: [
      typescript({
        rootDir: 'src',
        exclude: [
          'src/**/*.spec.*'
        ],
      }),
    ],
    output: [
      {
        format: 'cjs',
        file: `dist/${name}.cjs`,
        ...commonConfig,
      },
      {
        format: 'umd',
        file: `dist/${name}.umd.js`,
        name,
        ...commonConfig,
      },
      {
        format: 'umd',
        file: `dist/${name}.umd.min.js`,
        name,
        plugins: [terser()],
        ...commonConfig,
      },
      {
        format: 'esm',
        file: `dist/${name}.mjs`,
        ...commonConfig,
      },
      {
        format: 'esm',
        file: `dist/${name}.min.mjs`,
        plugins: [terser()],
        ...commonConfig,
      },
    ],
  },
]

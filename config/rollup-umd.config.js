import resolve from 'rollup-plugin-node-resolve'

import sourcemaps from 'rollup-plugin-sourcemaps'

const pkg = require('../package.json')

const name = pkg.name.replace(/-([a-z])/g, g => {
  return g[1].toUpperCase()
})

const globals = {
  '@angular/common': 'ng.common',
  '@angular/core': 'ng.core',
}

const external = Object.keys(globals)

export default {
  external: external,
  input: `${pkg.module}`,
  output: {
    file: `${pkg.main}`,
    format: 'umd',
    name: `zef.${name}`,
    globals: globals,
    sourcemap: true,
    exports: 'named',
  },
  plugins: [resolve(), sourcemaps()],
}

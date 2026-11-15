import { build } from 'esbuild';
import { resolve } from 'node:path';

// Define a tiny plugin to stub out ajv
const stubAjvPlugin = {
  name: 'stub-ajv',
  setup(build) {
    build.onResolve({ filter: /^ajv/ }, args => ({
      path: args.path,
      namespace: 'stub-ajv-ns',
    }));
    build.onLoad({ filter: /.*/, namespace: 'stub-ajv-ns' }, () => ({
      contents: `
        export default class Ajv {
          compile() { return () => true; }
        }
      `,
      loader: 'js',
    }));
    build.onResolve({ filter: /^@bible-strong\/avatar-core$/ }, () => ({
      path: resolve('scratch/avatar-core/dist/index.js'),
    }));
  },
};

await build({
  entryPoints: ['scratch/avatar-web/dist/index.js'],
  bundle: true,
  format: 'esm',
  outfile: 'scratch/avatar-runtime-bundled.js',
  plugins: [stubAjvPlugin],
  target: 'es2022',
});

console.log('Successfully bundled avatar runtime!');

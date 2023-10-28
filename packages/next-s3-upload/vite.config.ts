import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), { encoding: 'utf8' })
);

let externalDependencies = ['dependencies', 'peerDependencies'].reduce<
  string[]
>(
  (result, group) => [
    ...result,
    ...(pkg[group] ? Object.keys(pkg[group]) : []),
  ],
  []
);

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/react.tsx'),
      name: 'next-deploy-notifications',
    },
    rollupOptions: {
      external: [...externalDependencies, /next\/.+/, /react\/.+/, /^node:/],
      input: {
        index: resolve(__dirname, 'src/index.tsx'),
        route: resolve(__dirname, 'src/route.ts'),
      },
      plugins: [typescript(), singleTypeDef()],
      output: [
        {
          entryFileNames: '[name].js',
          format: 'es',
        },
        {
          entryFileNames: '[name].[format].js',
          format: 'cjs',
        },
      ],
    },
  },
});

function singleTypeDef() {
  return {
    name: 'Generate a single typings file for all entry points.',

    async generateBundle(options, bundle) {
      let files = Object.keys(bundle);
      let defFiles = files.filter(file => file.match(/^\w+\.d\.ts$/));
      let types = defFiles.map(file => bundle[file].source);
      let content = types.join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'types.d.ts',
        source: content,
      });
    },
  };
}

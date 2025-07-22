import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      include: ['src/lib/**/*'],
      exclude: ['src/vite-env.d.ts'],
      tsconfigPath: './tsconfig.app.json',
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace('/src/lib', ''),
        content,
      }),
    }) as any
  ],
   build: {
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/lib/index.ts'),
        'transitions': resolve(__dirname, 'src/lib/transitions/index.ts'),
        'view-transitions': resolve(__dirname, 'src/lib/view-transitions/index.ts'),
        'types': resolve(__dirname, 'src/lib/types.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ["svelte"],
      output: {
        globals: {
          svelte: 'svelte',
        },
      }
    }
  },
})

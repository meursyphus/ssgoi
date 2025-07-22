import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/lib/index.ts'),
        'transitions/index': resolve(__dirname, 'src/lib/transitions/index.ts'),
        'view-transitions/index': resolve(__dirname, 'src/lib/view-transitions/index.ts'),
        types: resolve(__dirname, 'src/lib/types.ts'),
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['popmotion'],
      output: {
        preserveModules: false,
        exports: 'named',
        globals: {
          popmotion: 'popmotion'
        }
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
      include: ['src/lib/**/*'],
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace('/src/lib', ''),
        content,
      }),
    })
  ]
})
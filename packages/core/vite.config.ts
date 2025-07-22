import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/lib/index.ts'),
        transitions: resolve(__dirname, 'src/lib/transitions/index.ts'),
        "view-transitions": resolve(__dirname, 'src/lib/view-transitions/index.ts'),
        types: resolve(__dirname, 'src/lib/types.ts'),
      },
      name: 'Ssgoi',
      fileName: 'ssgoi',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {}
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    })
  ]
})
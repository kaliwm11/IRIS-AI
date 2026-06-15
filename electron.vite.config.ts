import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    build: {
      sourcemap: false, // CRITICAL: Never leak backend paths
      minify: true,
      bytecode: {
        transformArrowFunctions: true,
        removeBundleJS: true
      }
    }
  },
  preload: {
    build: {
      sourcemap: false, // CRITICAL: Hide stack traces
      minify: true,
      bytecode: {
        transformArrowFunctions: true,
        removeBundleJS: true
      }
    }
  },
  renderer: {
    publicDir: resolve('src/renderer/src/public'),
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()],
    build: {
      sourcemap: false, // CRITICAL: Destroys React source maps so your original code is gone
      minify: 'esbuild', // Aggressively scrambles your frontend variable names
      cssMinify: true,
      rollupOptions: {
        output: {
          // Obfuscates the generated file names so attackers can't easily map out your app structure
          chunkFileNames: 'assets/[hash].js',
          entryFileNames: 'assets/[hash].js',
          assetFileNames: 'assets/[hash][extname]'
        }
      }
    }
  }
})

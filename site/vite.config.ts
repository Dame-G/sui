import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { suiProps } from './props-plugin.ts'

export default defineConfig({
  plugins: [vue(), tailwindcss(), suiProps()],
  resolve: {
    alias: {
      '@/lib': fileURLToPath(new URL('../registry/lib', import.meta.url)),
      '@/components/ui': fileURLToPath(new URL('../registry/ui', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@registry': fileURLToPath(new URL('../registry', import.meta.url)),
    },
  },
  optimizeDeps: { exclude: ['@tailwindcss/vite', '@tailwindcss/oxide', 'tailwindcss'] },
  server: { port: 5173, strictPort: true, fs: { allow: ['..'] } },
})

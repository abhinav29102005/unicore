import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/unicore/', // Ensures relative assets work on GitHub Pages regardless of path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})

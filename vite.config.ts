import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        projects: fileURLToPath(new URL('./projects.html', import.meta.url)),
        mogAi: fileURLToPath(new URL('./mog-ai.html', import.meta.url)),
        nora: fileURLToPath(new URL('./nora.html', import.meta.url)),
      },
    },
  },
  server: {
    proxy: {
      '/ffmpeg/ffmpeg': { target: 'https://cdn.jsdelivr.net', changeOrigin: true, rewrite: (p) => p.replace(/^\/ffmpeg\/ffmpeg/, '/npm/@ffmpeg/ffmpeg@0.12.10/dist/esm') },
      '/ffmpeg/core': { target: 'https://cdn.jsdelivr.net', changeOrigin: true, rewrite: (p) => p.replace(/^\/ffmpeg\/core/, '/npm/@ffmpeg/core@0.12.10/dist/esm') },
    },
  },
})

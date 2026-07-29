import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function cleanUrlCopies() {
  return {
    name: 'clean-url-copies',
    closeBundle() {
      const outputDirectory = fileURLToPath(new URL('./dist', import.meta.url))
      const routes = [
        ['index.html', 'projects/index.html'],
        ['mog-ai.html', 'mog-ai/index.html'],
        ['nora.html', 'nora/index.html'],
      ]

      for (const [source, destination] of routes) {
        const destinationPath = resolve(outputDirectory, destination)
        mkdirSync(resolve(destinationPath, '..'), { recursive: true })
        copyFileSync(resolve(outputDirectory, source), destinationPath)
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), cleanUrlCopies()],
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
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

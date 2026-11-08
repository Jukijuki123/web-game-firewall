import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync('.')
  .filter(f => f.endsWith('.html'))
  .map(f => path.resolve(f));

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlFiles,
    },
  },
  server: {
    port: 5173,
    hmr: false,
  },
  css: {
    devSourcemap: true,
  },
});

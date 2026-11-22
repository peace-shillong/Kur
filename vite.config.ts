import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    target: 'es2022',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-d3': ['d3'],
          'vendor-motion': ['framer-motion'],
          'vendor-lucide': ['lucide-react']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5175,
    cors: true
  }
});

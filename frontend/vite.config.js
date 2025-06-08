import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 3000,
    allowedHosts: ['picuppal08.onrender.com'], // Allow Render domain
  },
});
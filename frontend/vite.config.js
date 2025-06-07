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
    outDir: 'dist', // Ensure this matches Render’s publish directory
  },
  preview: {
    host: '0.0.0.0', // Bind to all interfaces
    port: parseInt(process.env.PORT, 10) || 3000, // Use Render’s PORT or fallback to 3000
  },
});
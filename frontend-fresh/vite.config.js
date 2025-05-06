/** @type {import('vite').UserConfig} */
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://codetracker-cxnp.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
};

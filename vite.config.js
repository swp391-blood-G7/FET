import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
    port: 5173,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // địa chỉ backend của bạn
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

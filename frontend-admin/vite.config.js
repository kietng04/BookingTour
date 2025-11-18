import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
    proxy: {
      // Dashboard endpoints: route to booking-service
      '/api/dashboard': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // Upload endpoints: route directly to tour-service (bypass API Gateway)
      '/api/upload': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // All other /api requests go through API Gateway
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: false,
      }
    }
  },
  preview: {
    port: 4174
  }
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy any requests starting with /api to backend at localhost:8000
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Optional: remove /api prefix when forwarding to backend
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})

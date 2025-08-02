import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gty-express.onrender.com',
        changeOrigin: true,
      },
    },
    // AJOUT DE CETTE LIGNE POUR AUTORISER REPLIT
    allowedHosts: ['.replit.dev'],
  },
})
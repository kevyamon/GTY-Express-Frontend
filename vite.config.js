import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gty-express.onrender.com', // Votre lien backend
        changeOrigin: true,
      },
    },
  },
})
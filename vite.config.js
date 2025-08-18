import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import versionInjector from './vite-plugin-version-injector.js';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // --- MODIFICATION : On réintroduit la configuration Workbox ---
      // Cela force le nouveau Service Worker à s'activer dès que possible
      // après que l'utilisateur clique sur "Mettre à jour".
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
      },
      // --- FIN DE LA MODIFICATION ---
      manifest: {
        name: 'GTY Express',
        short_name: 'GTY',
        description: 'Votre destination pour trouver les meilleurs produits, rapidement et simplement.',
        theme_color: '#1d2b64',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
    versionInjector(), 
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://gty-express.onrender.com',
        changeOrigin: true,
      },
    },
    allowedHosts: ['.replit.dev', 'localhost'],
  },
});
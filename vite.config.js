import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// On s'assure que le chemin d'importation est correct
import versionInjector from './vite-plugin-version-injector.js';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // On retire 'registerType' pour empêcher la mise à jour automatique conflictuelle.
      workbox: {
        // Cette option force le nouveau Service Worker à s'activer dès qu'il est prêt.
        skipWaiting: true,
        // Celle-ci assure qu'il prend le contrôle de la page immédiatement.
        clientsClaim: true,
      },
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
    // Notre plugin de version est bien appelé ici.
    versionInjector(), 
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://gty-express.onrender.com',
        changeOrigin: true,
      },
    },
    allowedHosts: ['.replit.dev'],
  },
});
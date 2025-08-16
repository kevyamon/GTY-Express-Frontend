import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import versionInjector from './vite-plugin-version-injector.js';

export default defineConfig({
  plugins: [
    react(),
    versionInjector(), 
    VitePWA({
      // --- MODIFICATION 1 : On change la stratégie de mise à jour ---
      // 'autoUpdate' va vérifier automatiquement à chaque chargement de page.
      registerType: 'autoUpdate',
      
      workbox: {
        // --- MODIFICATION 2 : On dit au Service Worker d'être proactif ---
        // skipWaiting: true -> Le nouveau Service Worker s'active dès qu'il est prêt.
        skipWaiting: true,
        // clientsClaim: true -> Il prend le contrôle de la page immédiatement.
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
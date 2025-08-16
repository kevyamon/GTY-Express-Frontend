import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// --- NOUVEAUX IMPORTS ---
import versionInjector from './vite-plugin-version-injector.js';

export default defineConfig({
  // La section 'define' est maintenant gérée par notre plugin, on peut la retirer d'ici.
  plugins: [
    react(),
    // On active notre nouveau plugin
    versionInjector(), 
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'script',
      workbox: {
        skipWaiting: false,
        clientsClaim: false,
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
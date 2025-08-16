// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// On importe le package.json pour lire la version
import packageJson from './package.json';

export default defineConfig({
  // --- AJOUT DE CETTE SECTION ---
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version),
  },
  // --- FIN DE L'AJOUT ---
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'script',
      // --- MODIFICATION : BLOC WORKBOX SUPPRIMÉ ---
      // En retirant les lignes 'skipWaiting' et 'clientsClaim',
      // on permet au nouveau Service Worker d'attendre l'autorisation
      // de l'utilisateur avant de s'activer. C'est ce qui va
      // déclencher l'affichage du modal de mise à jour.
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
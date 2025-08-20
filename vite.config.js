// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import versionInjector from './vite-plugin-version-injector.js';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // --- MODIFICATION ICI ---
      registerType: 'autoUpdate',
      injectRegister: false, // On désactive l'injection automatique
      strategies: 'injectManifest', // On utilise notre propre SW
      srcDir: 'src', // Le dossier où se trouve notre fichier source de SW
      filename: 'sw.js', // Le nom de notre fichier source
      // --- FIN DE LA MODIFICATION ---
      manifest: {
        name: 'GTY Express',
        short_name: 'GTY Express',
        description: 'Plateforme de E-Commerce!.',
        theme_color: '#1d2b64',
        background_color: '#1d2b64',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    versionInjector(),
  ],
});
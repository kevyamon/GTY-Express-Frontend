// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import versionInjector from './vite-plugin-version-injector.js';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifest: {
        name: 'GTY Express',
        short_name: 'GTY Express',
        description: 'Plateforme de E-Commerce!.',
        theme_color: '#1d2b64',
        background_color: '#1d2b64',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        // --- DÉBUT DES AJOUTS ---
        id: '/', // ID unique pour ton application
        orientation: 'portrait', // Orientation préférée
        categories: ['shopping', 'ecommerce', 'business'], // Catégories pour les stores
        screenshots: [
          {
            src: '/src/assets/products/sc1.png',
            sizes: '500x500',
            type: 'image/png',
            label: 'Découvrez nos produits High-Tech'
          },
          {
            src: '/src/assets/products/sc2.png',
            sizes: '500x500',
            type: 'image/png',
            label: 'Mode et élégance'
          },
          {
            src: '/src/assets/products/sc3.png',
            sizes: '500x500',
            type: 'image/png',
            label: 'Accessoires indispensables'
          }
        ],
        // --- FIN DES AJOUTS ---
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
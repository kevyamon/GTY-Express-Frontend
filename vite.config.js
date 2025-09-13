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
        id: '/',
        orientation: 'portrait',
        categories: ['shopping', 'ecommerce', 'business'],
        
        screenshots: [
          {
            src: '/screenshots/screenshot-1.png',
            sizes: '500x500',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Découvrez nos produits High-Tech'
          },
          {
            src: '/screenshots/screenshot-2.png',
            sizes: '500x500',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mode et élégance'
          },
          {
            src: '/screenshots/screenshot-3.png',
            sizes: '500x500',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Accessoires indispensables'
          },
          {
            src: '/screenshots/screenshot-large.png', 
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Vue complète sur ordinateur'
          }
        ],

        prefer_related_applications: false,
        display_override: ["window-controls-overlay", "standalone"],
        
        shortcuts: [
          {
            name: "Mes Commandes",
            short_name: "Commandes",
            description: "Voir l'historique de vos commandes",
            url: "/profile",
            icons: [{ "src": "/pwa-192x192.png", "sizes": "192x192" }]
          },
          {
            name: "Promotions",
            short_name: "Promos",
            description: "Voir toutes les promotions en cours",
            url: "/promotions",
            icons: [{ "src": "/pwa-192x192.png", "sizes": "192x192" }]
          },
          {
            name: "Mon Panier",
            short_name: "Panier",
            description: "Accéder à votre panier",
            url: "/cart",
            icons: [{ "src": "/pwa-192x192.png", "sizes": "192x192" }]
          }
        ],

        share_target: {
          action: "/products",
          method: "GET",
          params: {
            title: "title",
            text: "text",
            url: "url"
          }
        },

        // --- DÉBUT DE L'AJOUT ---
        // 3. Gestionnaires de protocoles (Protocol Handlers)
        // Permet d'enregistrer un protocole personnalisé pour l'application.
        protocol_handlers: [
          {
            protocol: "web+gtyexpress",
            url: "/product/%s"
          }
        ],
        // --- FIN DE L'AJOUT ---

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
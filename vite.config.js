// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import versionInjector from './vite-plugin-version-injector.js'; // <-- 1. IMPORTER NOTRE PLUGIN

export default defineConfig({
  plugins: [
    react(),
    versionInjector(), // <-- 2. AJOUTER LE PLUGIN ICI
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
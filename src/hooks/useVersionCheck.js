// src/hooks/useVersionCheck.js
import { useState, useEffect, useCallback } from 'react';

// Intervalle de vérification (toutes les 2 minutes)
const CHECK_INTERVAL = 2 * 60 * 1000; 

export const useVersionCheck = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState('');

  const checkVersion = useCallback(async () => {
    try {
      // 1. Lire la version "tatouée" sur la page actuelle
      const meta = document.querySelector('meta[name="app-version"]');
      if (!meta) return;
      const localVersion = meta.content;

      // 2. Demander la dernière version au serveur (en ajoutant un cache buster)
      const response = await fetch(`/meta.json?t=${new Date().getTime()}`);
      const serverMeta = await response.json();
      const serverVersion = serverMeta.fullVersion;

      // 3. Comparer et déclencher l'alerte si elles sont différentes
      if (localVersion !== serverVersion) {
        setIsUpdateAvailable(true);
        setNewVersion(serverMeta.displayVersion); // On utilise la version "propre" pour l'affichage
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de version:', error);
    }
  }, []);

  useEffect(() => {
    // Vérifier une première fois au chargement
    checkVersion(); 
    // Puis lancer la vérification à intervalle régulier
    const intervalId = setInterval(checkVersion, CHECK_INTERVAL);
    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(intervalId);
  }, [checkVersion]);

  return { isUpdateAvailable, newVersion };
};
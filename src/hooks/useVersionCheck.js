import { useState, useEffect, useCallback, useRef } from 'react';

// Intervalle de vérification : 60 000 millisecondes = 1 minute
const POLLING_INTERVAL = 60000;

export const useVersionCheck = () => {
  const [newVersionInfo, setNewVersionInfo] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  
  // --- MODIFICATION : On utilise une référence pour stocker l'ID de l'intervalle ---
  const intervalRef = useRef(null);

  // La fonction qui arrête la vérification
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Vérification des mises à jour arrêtée.');
    }
  }, []);

  const checkForUpdate = useCallback(async () => {
    try {
      const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
      if (!currentVersion) {
        console.error("La balise meta 'app-version' est introuvable.");
        return;
      }

      // On ajoute un timestamp pour éviter la mise en cache du fichier par le navigateur
      const response = await fetch(`/version.json?t=${new Date().getTime()}`);
      if (!response.ok) return;
      
      const serverVersionInfo = await response.json();

      if (serverVersionInfo.commitHash && serverVersionInfo.commitHash !== currentVersion) {
        console.log('Nouvelle version détectée !', serverVersionInfo);
        setNewVersionInfo(serverVersionInfo);
        setIsUpdateAvailable(true);
        // --- AMÉLIORATION : On arrête la vérification dès qu'une mise à jour est trouvée ---
        stopPolling(); 
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la version :", error);
    }
  }, [stopPolling]); // On ajoute stopPolling aux dépendances

  useEffect(() => {
    // On lance la vérification initiale
    checkForUpdate();
    // On stocke l'ID de l'intervalle dans notre référence
    intervalRef.current = setInterval(checkForUpdate, POLLING_INTERVAL);

    // La fonction de nettoyage s'assurera d'arrêter l'intervalle
    return () => stopPolling();
  }, [checkForUpdate, stopPolling]);

  // Le hook retourne maintenant la fonction pour arrêter la vérification
  return {
    isUpdateAvailable,
    newVersionInfo,
    stopPolling,
  };
};
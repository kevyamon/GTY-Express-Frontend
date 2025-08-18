import { useState, useEffect, useCallback, useRef } from 'react';

const POLLING_INTERVAL = 60000;

export const useVersionCheck = () => {
  const [newVersionInfo, setNewVersionInfo] = useState(null);
  // --- MODIFICATION : On exporte la fonction pour modifier cet état ---
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  
  const intervalRef = useRef(null);

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

      const response = await fetch(`/version.json?t=${new Date().getTime()}`);
      if (!response.ok) return;
      
      const serverVersionInfo = await response.json();

      if (serverVersionInfo.commitHash && serverVersionInfo.commitHash !== currentVersion) {
        console.log('Nouvelle version détectée !', serverVersionInfo);
        setNewVersionInfo(serverVersionInfo);
        setIsUpdateAvailable(true);
        stopPolling(); 
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la version :", error);
    }
  }, [stopPolling]);

  useEffect(() => {
    checkForUpdate();
    intervalRef.current = setInterval(checkForUpdate, POLLING_INTERVAL);

    return () => stopPolling();
  }, [checkForUpdate, stopPolling]);

  return {
    isUpdateAvailable,
    newVersionInfo,
    stopPolling,
    setIsUpdateAvailable, // <-- On retourne la fonction ici
  };
};
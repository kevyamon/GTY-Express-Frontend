import { useState, useEffect, useCallback } from 'react';

// Intervalle de vérification : 60 000 millisecondes = 1 minute
const POLLING_INTERVAL = 60000;

export const useVersionCheck = () => {
  // L'état qui contiendra les informations sur la mise à jour
  const [newVersionInfo, setNewVersionInfo] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  // La fonction qui effectue la vérification
  const checkForUpdate = useCallback(async () => {
    try {
      // 1. Lire la version actuelle de l'application depuis la balise meta dans l'HTML
      const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
      if (!currentVersion) {
        console.error("La balise meta 'app-version' est introuvable.");
        return;
      }

      // 2. Télécharger le fichier version.json du serveur (avec un timestamp pour éviter le cache)
      const response = await fetch(`/version.json?t=${new Date().getTime()}`);
      if (!response.ok) return; // Si le fichier n'est pas trouvé, on arrête
      
      const serverVersionInfo = await response.json();

      // 3. Comparer les versions (basé sur le hash du commit)
      if (serverVersionInfo.commitHash && serverVersionInfo.commitHash !== currentVersion) {
        console.log('Nouvelle version détectée !', serverVersionInfo);
        setNewVersionInfo(serverVersionInfo); // Stocke les détails de la nouvelle version
        setIsUpdateAvailable(true); // Signale qu'une mise à jour est disponible
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la version :", error);
    }
  }, []);

  useEffect(() => {
    // 4. Lancer la vérification une première fois au chargement, puis toutes les minutes
    checkForUpdate(); // Vérification immédiate
    const interval = setInterval(checkForUpdate, POLLING_INTERVAL);

    // 5. Si une mise à jour est trouvée, on arrête l'intervalle
    if (isUpdateAvailable) {
      clearInterval(interval);
    }

    // Nettoyage de l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  }, [checkForUpdate, isUpdateAvailable]);

  // Le hook retourne un objet simple avec le statut et les détails de la mise à jour
  return {
    isUpdateAvailable,
    newVersionInfo,
  };
};
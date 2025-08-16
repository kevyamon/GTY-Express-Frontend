import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'react-toastify';

// On augmente l'intervalle pour ne pas surcharger le serveur
const CHECK_INTERVAL = 1 * 60 * 1000; // Vérification toutes les 1 minutes

export const useVersionCheck = () => {
  // --- NOUVEAUX ÉTATS ---
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newVersionInfo, setNewVersionInfo] = useState(null); // Pour stocker les infos de la NOUVELLE version
  // --- FIN DES NOUVEAUX ÉTATS ---

  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);

  // Le hook du Service Worker est toujours là, il fait le travail lourd en arrière-plan
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      // Cette partie gère l'affichage du modal "Mise à jour terminée !"
      // que nous finirons à l'étape 4.
      if (sessionStorage.getItem('swUpdateCompleted')) {
        sessionStorage.removeItem('swUpdateCompleted');
        // On force la réinitialisation pour afficher le modal de succès
        window.dispatchEvent(new Event('updateCompleted'));
      }
    },
    onRegisterError(error) {
      console.error('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  // --- NOUVELLE FONCTION POUR VÉRIFIER LE FICHIER version.json ---
  const checkForUpdate = useCallback(async () => {
    try {
      // On ajoute un paramètre aléatoire pour éviter que le navigateur mette le fichier en cache
      const response = await fetch(`/version.json?t=${new Date().getTime()}`);
      if (!response.ok) return;

      const serverVersionInfo = await response.json();
      const currentVersion = import.meta.env.VITE_APP_VERSION;

      // Si la version sur le serveur est différente de celle de l'application
      if (serverVersionInfo.version !== currentVersion) {
        setNewVersionInfo(serverVersionInfo); // On stocke les infos de la nouvelle version
        setIsUpdateAvailable(true);
        // On demande au Service Worker de télécharger la mise à jour
        updateServiceWorker(true); 
      }
    } catch (error) {
      console.error('Impossible de vérifier la version:', error);
    }
  }, [updateServiceWorker]);
  // --- FIN DE LA NOUVELLE FONCTION ---

  // On lance la vérification au chargement, puis toutes les 5 minutes
  useEffect(() => {
    checkForUpdate(); // Vérification immédiate
    const interval = setInterval(checkForUpdate, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkForUpdate]);

  // Quand le Service Worker confirme que la mise à jour est prête (needRefresh = true)
  useEffect(() => {
    if (needRefresh) {
      setIsModalOpen(true);
    }
  }, [needRefresh]);

  const confirmUpdate = useCallback(async () => {
    setIsModalOpen(false);
    setIsUpdateInProgress(true);
    sessionStorage.setItem('swUpdateCompleted', 'true');
    await updateServiceWorker(true);
  }, [updateServiceWorker]);

  const declineUpdate = useCallback(() => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton "Màj".');
  }, []);

  const openUpdateModal = useCallback(() => {
    if (isUpdateAvailable) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable]);

  return {
    isUpdateAvailable,
    isUpdateInProgress,
    isModalOpen,
    updateDeclined,
    newVersionInfo, // On retourne les infos de la nouvelle version
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  };
};
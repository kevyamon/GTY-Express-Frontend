import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'react-toastify';

export const useVersionCheck = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newVersionInfo, setNewVersionInfo] = useState(null);
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      // NOUVELLE LOGIQUE FIABLE :
      // On vérifie si notre "drapeau" existe dans le stockage de session.
      if (sessionStorage.getItem('swUpdateCompleted')) {
        // Si oui, on retire le drapeau et on envoie un événement global
        // pour dire à l'application d'afficher le modal de succès.
        sessionStorage.removeItem('swUpdateCompleted');
        window.dispatchEvent(new Event('updateCompleted'));
      }
    },
    onRegisterError(error) {
      console.error('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  // --- C'EST CETTE PARTIE QUI CHANGE COMPLÈTEMENT ---
  useEffect(() => {
    // Cette fonction ne s'exécute que lorsque le Service Worker nous dit
    // qu'une mise à jour a été téléchargée et est prête (needRefresh = true).
    if (needRefresh) {
      const fetchVersionInfo = async () => {
        try {
          // On va chercher les détails de la version qui est prête.
          const response = await fetch(`/version.json?t=${new Date().getTime()}`);
          if (response.ok) {
            const serverVersionInfo = await response.json();
            setNewVersionInfo(serverVersionInfo);
          }
        } catch (error) {
          console.error('Impossible de récupérer les détails de la nouvelle version :', error);
        } finally {
          // Quoi qu'il arrive, on marque la mise à jour comme disponible et on ouvre le modal.
          setIsUpdateAvailable(true);
          setIsModalOpen(true);
        }
      };

      fetchVersionInfo();
    }
  }, [needRefresh]);
  // --- FIN DE LA MODIFICATION MAJEURE ---

  const confirmUpdate = useCallback(async () => {
    setIsModalOpen(false);
    setIsUpdateInProgress(true);
    // On pose notre "drapeau" juste avant de lancer la mise à jour.
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
    newVersionInfo,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  };
};
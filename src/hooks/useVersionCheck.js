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
      if (sessionStorage.getItem('swUpdateCompleted')) {
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
    // qu'une mise à jour a été téléchargée et est prête.
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
    // On ne dépend que de 'needRefresh', le signal du Service Worker.
  }, [needRefresh]);
  // --- FIN DE LA MODIFICATION MAJEURE ---

  const confirmUpdate = useCallback(async () => {
    setIsModalOpen(false);
    setIsUpdateInProgress(true);
    sessionStorage.setItem('swUpdateCompleted', 'true');
    // On appelle updateServiceWorker(true) ICI pour dire "installe la version en attente".
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
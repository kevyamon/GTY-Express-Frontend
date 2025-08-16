import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'react-toastify';

const CHECK_INTERVAL = 60000; // Vérification toutes les 60 secondes

export const useVersionCheck = () => {
  // États internes pour gérer le processus de mise à jour
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      // Si on détecte qu'une mise à jour vient de se terminer (après rechargement)
      if (sessionStorage.getItem('swUpdateCompleted')) {
        toast.success('Application mise à jour avec succès !');
        sessionStorage.removeItem('swUpdateCompleted');
        // On réinitialise tous les états
        setIsUpdateAvailable(false);
        setIsUpdateInProgress(false);
        setIsModalOpen(false);
        setUpdateDeclined(false);
      }
    },
    onRegisterError(error) {
      console.error('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  // Lance la vérification périodique
  useEffect(() => {
    const interval = setInterval(() => {
      // On ne vérifie que si aucune mise à jour n'est déjà en attente ou en cours
      if (!isUpdateAvailable && !isUpdateInProgress) {
        updateServiceWorker(true);
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [updateServiceWorker, isUpdateAvailable, isUpdateInProgress]);

  // Réagit quand le Service Worker signale qu'une mise à jour est prête
  useEffect(() => {
    if (needRefresh) {
      setIsUpdateAvailable(true);
      // On attend 5 secondes avant de proposer la mise à jour
      setTimeout(() => {
        setIsModalOpen(true);
      }, 5000);
    }
  }, [needRefresh]);

  // Fonction pour lancer la mise à jour
  const confirmUpdate = useCallback(async () => {
    setIsModalOpen(false);
    setIsUpdateInProgress(true);
    sessionStorage.setItem('swUpdateCompleted', 'true');
    await updateServiceWorker(true);
  }, [updateServiceWorker]);

  // Fonction pour refuser temporairement
  const declineUpdate = useCallback(() => {
    setIsModalOpen(false);
    setUpdateDeclined(true); // On note que l'utilisateur a refusé
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton "Màj".');
  }, []);

  // Fonction pour rouvrir le modal
  const openUpdateModal = useCallback(() => {
    if (isUpdateAvailable) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable]);

  // On retourne toutes les valeurs et fonctions dont l'application aura besoin
  return {
    isUpdateAvailable,
    isUpdateInProgress,
    isModalOpen,
    updateDeclined,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  };
};
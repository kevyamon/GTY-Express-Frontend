import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'react-toastify';

const CHECK_INTERVAL = 60 * 1000; // Vérification toutes les 60 secondes

export const useVersionCheck = () => {
  // États internes pour gérer le processus de mise à jour
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);

  // --- NOUVEL ÉTAT POUR LE MODAL DE SUCCÈS ---
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      // Si on détecte qu'une mise à jour vient de se terminer (après rechargement)
      if (sessionStorage.getItem('swUpdateCompleted')) {
        setShowUpdateCompleteModal(true); // On déclenche le modal de succès !
        sessionStorage.removeItem('swUpdateCompleted'); // On nettoie le drapeau
        // On réinitialise tous les états pour être propre
        setIsUpdateAvailable(false);
        setIsUpdateInProgress(false);
        setIsModalOpen(false);
        setUpdateDeclined(false);
      } else {
        // Lance une vérification au démarrage, puis toutes les X secondes
        if (r?.installing) {
            console.log('Un nouveau Service Worker est en cours d\'installation.');
        }
        setInterval(() => {
          console.log("Vérification d'une nouvelle version...");
          r.update();
        }, CHECK_INTERVAL);
      }
    },
    onRegisterError(error) {
      console.error('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  // Réagit quand le Service Worker signale qu'une mise à jour est prête
  useEffect(() => {
    if (needRefresh) {
      console.log("Mise à jour disponible !");
      setIsUpdateAvailable(true);
      // On affiche le modal dès que la MàJ est prête, sans timer complexe
      setIsModalOpen(true);
    }
  }, [needRefresh]);

  // Fonction pour lancer la mise à jour
  const confirmUpdate = useCallback(async () => {
    setIsModalOpen(false);
    setIsUpdateInProgress(true);
    // On pose le drapeau AVANT de lancer la mise à jour
    sessionStorage.setItem('swUpdateCompleted', 'true');
    // Attend 1 seconde pour que l'utilisateur voie l'état "Installation..."
    await new Promise(resolve => setTimeout(resolve, 1000));
    await updateServiceWorker(true);
  }, [updateServiceWorker]);

  // Fonction pour refuser temporairement
  const declineUpdate = useCallback(() => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton dans le menu.');
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
    showUpdateCompleteModal, // On exporte le nouvel état
    setShowUpdateCompleteModal, // Et la fonction pour le contrôler
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  };
};
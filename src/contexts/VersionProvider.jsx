import React, { useState, useCallback, useEffect } from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import { toast } from 'react-toastify';

export const VersionProvider = ({ children }) => {
  const { isUpdateAvailable, newVersionInfo, stopPolling } = useVersionCheck();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isUpdateAvailable && !updateDeclined && !isUpdating) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable, updateDeclined, isUpdating]);

  // --- CORRECTION : La nouvelle fonction de mise à jour ---
  const confirmUpdate = useCallback(() => {
    // On s'assure que le navigateur est compatible avec les Service Workers
    if (!('serviceWorker' in navigator)) {
      toast.error("Les mises à jour automatiques ne sont pas supportées par votre navigateur.");
      return;
    }

    setIsUpdating(true); // Affiche le spinner dans le modal
    setIsModalOpen(false); // Ferme le modal de proposition
    stopPolling(); // Arrête de vérifier les versions

    // On récupère le "gestionnaire" de Service Worker du navigateur
    navigator.serviceWorker.getRegistration().then(reg => {
      // S'il n'y a pas de mise à jour en attente, on force un rechargement complet (cas rare)
      if (!reg || !reg.waiting) {
        sessionStorage.setItem('updateCompleted', 'true');
        if (newVersionInfo?.version) {
          sessionStorage.setItem('newAppVersion', newVersionInfo.version);
        }
        window.location.reload(true);
        return;
      }

      // ÉTAPE 1 : On se prépare à écouter l'événement qui nous dira quand le nouveau SW a pris le contrôle.
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // ÉTAPE 3 : Le nouveau SW est maintenant actif. Il est temps de recharger !
        sessionStorage.setItem('updateCompleted', 'true');
        if (newVersionInfo?.version) {
          sessionStorage.setItem('newAppVersion', newVersionInfo.version);
        }
        window.location.reload();
      }, { once: true }); // On ne veut écouter cet événement qu'une seule fois.

      // ÉTAPE 2 : On envoie un message au SW en attente pour lui dire de s'activer.
      // C'est cette action qui va déclencher l'événement 'controllerchange' que l'on écoute juste au-dessus.
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    });
  }, [stopPolling, newVersionInfo]);
  // --- FIN DE LA CORRECTION ---

  const declineUpdate = useCallback(() => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton dans le menu.');
  }, []);

  const openUpdateModal = useCallback(() => {
    if (isUpdateAvailable) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable]);

  const value = {
    isUpdateAvailable,
    isModalOpen,
    updateDeclined,
    newVersionInfo,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
    isUpdating,
  };

  return (
    <VersionContext.Provider value={value}>
      <UpdateModal
        show={isModalOpen}
        handleClose={declineUpdate}
        onConfirmUpdate={confirmUpdate}
        newVersionInfo={newVersionInfo}
        isUpdating={isUpdating}
      />
      {children}
    </VersionContext.Provider>
  );
};
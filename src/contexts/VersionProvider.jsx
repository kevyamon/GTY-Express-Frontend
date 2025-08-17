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
    // --- MODIFICATION : On vérifie le drapeau avant d'ouvrir le modal ---
    if (isUpdateAvailable && !updateDeclined && !isUpdating && !sessionStorage.getItem('pwaUpdateInProgress')) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable, updateDeclined, isUpdating]);

  const confirmUpdate = useCallback(() => {
    if (!('serviceWorker' in navigator)) {
      toast.error("Les mises à jour automatiques ne sont pas supportées par votre navigateur.");
      return;
    }

    // --- AMÉLIORATION 1 : On pose notre drapeau et on affiche le spinner ---
    sessionStorage.setItem('pwaUpdateInProgress', 'true');
    setIsUpdating(true);
    // On ne ferme PAS le modal ici pour que l'utilisateur voie le chargement.
    stopPolling();

    navigator.serviceWorker.getRegistration().then(reg => {
      if (!reg || !reg.waiting) {
        sessionStorage.setItem('updateCompleted', 'true');
        if (newVersionInfo?.version) {
          sessionStorage.setItem('newAppVersion', newVersionInfo.version);
        }
        window.location.reload(true);
        return;
      }
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        sessionStorage.setItem('updateCompleted', 'true');
        if (newVersionInfo?.version) {
          sessionStorage.setItem('newAppVersion', newVersionInfo.version);
        }
        window.location.reload();
      }, { once: true });

      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    });
  }, [stopPolling, newVersionInfo]);

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
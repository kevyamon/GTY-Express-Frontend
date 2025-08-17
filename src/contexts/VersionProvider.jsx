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
  
  const [updateFunction, setUpdateFunction] = useState(null);

  useEffect(() => {
    const handleUpdateReady = (event) => {
      setUpdateFunction(() => event.detail.update);
    };
    window.addEventListener('pwa-update-available', handleUpdateReady);
    return () => window.removeEventListener('pwa-update-available', handleUpdateReady);
  }, []);

  useEffect(() => {
    if (isUpdateAvailable && !updateDeclined && !isUpdating) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable, updateDeclined, isUpdating]);

  const confirmUpdate = useCallback(() => {
    // --- CORRECTION APPLIQUÉE ICI ---
    // On verrouille l'état de mise à jour et on le stocke dans la session
    setIsUpdating(true);
    setIsModalOpen(false);
    sessionStorage.setItem('pwaUpdateInProgress', 'true'); // Ce drapeau persiste après le rechargement
    
    if (updateFunction) {
      sessionStorage.setItem('updateCompleted', 'true');
      if (newVersionInfo?.version) {
        sessionStorage.setItem('newAppVersion', newVersionInfo.version);
      }
      updateFunction();
    } else {
      toast.info("Préparation de la mise à jour, la page va se recharger...");
      window.location.reload(true);
    }
    // --- FIN DE LA CORRECTION ---
  }, [updateFunction, newVersionInfo]);

  const declineUpdate = useCallback(() => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton dans le menu ou le header.');
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
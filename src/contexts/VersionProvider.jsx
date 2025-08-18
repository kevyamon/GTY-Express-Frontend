import React, { useState, useCallback, useEffect } from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import { toast } from 'react-toastify';

export const VersionProvider = ({ children }) => {
  const { isUpdateAvailable, newVersionInfo } = useVersionCheck();

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
      // Si une mise à jour est en cours (détecté via sessionStorage), on ne remontre pas le modal
      if (!sessionStorage.getItem('pwaUpdateInProgress')) {
        setIsModalOpen(true);
      }
    }
  }, [isUpdateAvailable, updateDeclined, isUpdating]);

  const confirmUpdate = useCallback(() => {
    // On indique qu'une mise à jour est en cours
    setIsUpdating(true); 
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    if (updateFunction) {
      if (newVersionInfo?.version) {
        sessionStorage.setItem('newAppVersion', newVersionInfo.version);
      }
      sessionStorage.setItem('updateCompleted', 'true');
      updateFunction();
    } else {
      toast.info("Préparation de la mise à jour, la page va se recharger...");
      window.location.reload(true);
    }
  }, [updateFunction, newVersionInfo]);

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
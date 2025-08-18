import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // <-- 1. AJOUT : Pour communiquer avec le loader
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import { toast } from 'react-toastify';
import { showLoader, hideLoader } from '../slices/loaderSlice'; // <-- 2. AJOUT : On importe les actions du loader

export const VersionProvider = ({ children }) => {
  const { isUpdateAvailable, newVersionInfo } = useVersionCheck();
  const dispatch = useDispatch(); // <-- 3. AJOUT : On initialise le dispatcher

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
      if (!sessionStorage.getItem('pwaUpdateInProgress')) {
        setIsModalOpen(true);
      }
    }
  }, [isUpdateAvailable, updateDeclined, isUpdating]);

  const confirmUpdate = useCallback(() => {
    // --- MODIFICATIONS PRINCIPALES ICI ---
    setIsModalOpen(false); // 4. On ferme DÉFINITIVEMENT le modal de proposition
    dispatch(showLoader()); // 5. On affiche le loader global
    // --- FIN DES MODIFICATIONS ---

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
  }, [updateFunction, newVersionInfo, dispatch]); // <-- 6. AJOUT : dispatch dans les dépendances

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
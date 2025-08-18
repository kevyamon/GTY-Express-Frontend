import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import { toast } from 'react-toastify';
import { showLoader, hideLoader } from '../slices/loaderSlice';

export const VersionProvider = ({ children }) => {
  const { isUpdateAvailable, newVersionInfo, setIsUpdateAvailable } = useVersionCheck(); // <-- 1. On récupère la fonction pour changer l'état
  const dispatch = useDispatch();

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
    setIsModalOpen(false);
    dispatch(showLoader());
    
    // --- 2. MODIFICATION CLÉ ---
    // On force l'état à "pas de mise à jour" immédiatement.
    // Cela va griser le bouton dans le header et empêcher la modale de réapparaître.
    setIsUpdateAvailable(false);
    // --- FIN DE LA MODIFICATION ---

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
  }, [updateFunction, newVersionInfo, dispatch, setIsUpdateAvailable]); // <-- 3. On ajoute la fonction aux dépendances

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
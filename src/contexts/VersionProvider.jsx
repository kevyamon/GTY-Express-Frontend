import React, { useState, useCallback, useEffect } from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import { toast } from 'react-toastify';

export const VersionProvider = ({ children }) => {
  // --- MODIFICATION : On récupère la fonction pour arrêter la vérification ---
  const { isUpdateAvailable, newVersionInfo, stopPolling } = useVersionCheck();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isUpdateAvailable && !updateDeclined && !isUpdating) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable, updateDeclined, isUpdating]);

  const confirmUpdate = useCallback(() => {
    if (!newVersionInfo || !newVersionInfo.version) {
      toast.error("Les informations de la nouvelle version sont indisponibles. Réessayez.");
      return;
    }
    
    // --- AMÉLIORATIONS CLÉS ---
    // 1. On arrête immédiatement de vérifier les mises à jour pour éviter la boucle.
    stopPolling();
    
    // 2. On stocke les infos de la nouvelle version de manière fiable.
    sessionStorage.setItem('updateCompleted', 'true');
    sessionStorage.setItem('newAppVersion', newVersionInfo.version);
    
    // 3. On active l'indicateur de chargement.
    setIsUpdating(true);
    setIsModalOpen(false); // On ferme le modal de proposition

    // 4. On recharge la page pour appliquer la mise à jour.
    setTimeout(() => {
        window.location.reload(true);
    }, 500);

  }, [newVersionInfo, stopPolling]);

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
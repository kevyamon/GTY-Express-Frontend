import React, { useState, useCallback, useEffect } from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import { toast } from 'react-toastify';

export const VersionProvider = ({ children }) => {
  const { isUpdateAvailable, newVersionInfo } = useVersionCheck();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);
  // --- NOUVEL AJOUT : État pour gérer le chargement ---
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isUpdateAvailable && !updateDeclined) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable, updateDeclined]);

  const confirmUpdate = useCallback(() => {
    if (!newVersionInfo) return; // Sécurité pour éviter les erreurs
    
    // --- NOUVELLE LOGIQUE ---
    // 1. On stocke les infos de la nouvelle version pour les récupérer après le rechargement
    sessionStorage.setItem('updateCompleted', 'true');
    sessionStorage.setItem('newAppVersion', newVersionInfo.version); // On stocke la version
    
    // 2. On active l'indicateur de chargement
    setIsUpdating(true);

    // 3. On recharge la page (le loader sera visible un court instant)
    setTimeout(() => {
        window.location.reload(true);
    }, 500); // Petite pause pour que l'animation soit visible

  }, [newVersionInfo]);

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

  const value = {
    isUpdateAvailable,
    isModalOpen,
    updateDeclined,
    newVersionInfo,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
    isUpdating, // On expose le nouvel état
  };

  return (
    <VersionContext.Provider value={value}>
      <UpdateModal
        show={isModalOpen}
        handleClose={declineUpdate}
        onConfirmUpdate={confirmUpdate}
        newVersionInfo={newVersionInfo}
        isUpdating={isUpdating} // On passe l'état au modal
      />
      {children}
    </VersionContext.Provider>
  );
};
import React, { useState, useCallback, useEffect } from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import { toast } from 'react-toastify';

export const VersionProvider = ({ children }) => {
  // 1. On utilise notre nouveau hook simple
  const { isUpdateAvailable, newVersionInfo } = useVersionCheck();

  // 2. On gère l'état du modal et du refus de mise à jour
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateDeclined, setUpdateDeclined] = useState(false);

  // S'ouvre automatiquement si une MàJ est trouvée et qu'elle n'a pas été refusée
  useEffect(() => {
    if (isUpdateAvailable && !updateDeclined) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable, updateDeclined]);

  // 3. Fonction pour confirmer la mise à jour : on recharge simplement la page
  const confirmUpdate = useCallback(() => {
    // sessionStorage permet de se souvenir de l'action même après rechargement
    sessionStorage.setItem('updateCompleted', 'true'); 
    window.location.reload(true); // Le "true" force le rechargement depuis le serveur
  }, []);

  // 4. Fonction pour refuser temporairement
  const declineUpdate = useCallback(() => {
    setIsModalOpen(false);
    setUpdateDeclined(true);
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton "Màj".');
  }, []);

  // 5. Permet de rouvrir le modal depuis le bouton du header
  const openUpdateModal = useCallback(() => {
    if (isUpdateAvailable) {
      setIsModalOpen(true);
    }
  }, [isUpdateAvailable]);

  // On fournit toutes les valeurs nécessaires au reste de l'application
  const value = {
    isUpdateAvailable,
    isModalOpen,
    updateDeclined,
    newVersionInfo,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  };

  return (
    <VersionContext.Provider value={value}>
      <UpdateModal
        show={isModalOpen}
        handleClose={declineUpdate}
        onConfirmUpdate={confirmUpdate}
        newVersionInfo={newVersionInfo}
      />
      {children}
    </VersionContext.Provider>
  );
};
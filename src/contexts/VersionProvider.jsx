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
  
  // On stocke la fonction de mise à jour de la PWA fournie par le plugin
  const [updateFunction, setUpdateFunction] = useState(null);

  useEffect(() => {
    // Le plugin PWA émet un événement personnalisé quand une mise à jour est prête.
    // On l'écoute ici pour récupérer la fonction qui déclenche la mise à jour.
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
    // --- NOUVELLE LOGIQUE ROBUSTE ---
    // Si la fonction de mise à jour du plugin est disponible, on l'utilise.
    if (updateFunction) {
      setIsUpdating(true); // Affiche le chargement
      setIsModalOpen(false); // Ferme le modal de proposition
      
      // On pose un drapeau pour afficher le modal de succès après le rechargement
      sessionStorage.setItem('updateCompleted', 'true');
      if (newVersionInfo?.version) {
        sessionStorage.setItem('newAppVersion', newVersionInfo.version);
      }
      
      // On appelle la fonction magique du plugin qui gère tout pour nous !
      updateFunction();
      
    } else {
      // Sécurité : si la fonction n'est pas prête, on utilise l'ancienne méthode de rechargement.
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
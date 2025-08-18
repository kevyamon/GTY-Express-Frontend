import React from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';

// Ce composant ne gère plus d'état, il ne fait que "fournir" l'état du hook.
export const VersionProvider = ({ children }) => {
  // On récupère TOUT l'état et TOUTES les fonctions depuis notre hook centralisé.
  const {
    isUpdateAvailable,
    isUpdateInProgress,
    isModalOpen,
    updateDeclined,
    showUpdateCompleteModal, // On récupère aussi l'état du modal de succès
    setShowUpdateCompleteModal,
    confirmUpdate,
    declineUpdate,
    openUpdateModal,
  } = useVersionCheck();

  // On crée l'objet "value" qui sera passé au contexte.
  // Il contient toutes les informations et fonctions nécessaires.
  const value = {
    isUpdateAvailable,
    isUpdateInProgress,
    isModalOpen,
    updateDeclined,
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
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
        isUpdating={isUpdateInProgress}
      />
      {children}
    </VersionContext.Provider>
  );
};
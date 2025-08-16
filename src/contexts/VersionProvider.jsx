import React from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
import Header from '../components/Header'; // Nous aurons besoin de Header ici

// Ce composant "entourera" toute notre application
export const VersionProvider = ({ children }) => {
  // On récupère toute la logique et les états de notre hook
  const versionInfo = useVersionCheck();

  return (
    // On fournit toutes ces informations aux composants enfants
    <VersionContext.Provider value={versionInfo}>
      {/* On affiche le modal de mise à jour ici, contrôlé par le contexte */}
      <UpdateModal
        show={versionInfo.isModalOpen}
        handleClose={versionInfo.declineUpdate}
        onConfirmUpdate={versionInfo.confirmUpdate}
      />
      {children}
    </VersionContext.Provider>
  );
};
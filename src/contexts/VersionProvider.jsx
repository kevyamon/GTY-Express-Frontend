import React from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';

export const VersionProvider = ({ children }) => {
  const versionInfo = useVersionCheck();

  return (
    <VersionContext.Provider value={versionInfo}>
      <UpdateModal
        show={versionInfo.isModalOpen}
        handleClose={versionInfo.declineUpdate}
        onConfirmUpdate={versionInfo.confirmUpdate}
        // On s'assure que les détails de la nouvelle version sont bien passés ici
        newVersionInfo={versionInfo.newVersionInfo} 
      />
      {children}
    </VersionContext.Provider>
  );
};
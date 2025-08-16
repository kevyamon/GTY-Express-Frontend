import React from 'react';
import { VersionContext } from './VersionContext';
import { useVersionCheck } from '../hooks/useVersionCheck';
import UpdateModal from '../components/UpdateModal';
// On retire l'import de Header, il n'a rien à faire ici

export const VersionProvider = ({ children }) => {
  const versionInfo = useVersionCheck();

  return (
    <VersionContext.Provider value={versionInfo}>
      {/* --- MODIFICATION IMPORTANTE CI-DESSOUS --- */}
      <UpdateModal
        show={versionInfo.isModalOpen}
        handleClose={versionInfo.declineUpdate}
        onConfirmUpdate={versionInfo.confirmUpdate}
        // On passe les informations de la nouvelle version au modal !
        newVersionInfo={versionInfo.newVersionInfo} 
      />
      {children}
    </VersionContext.Provider>
  );
};
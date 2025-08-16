import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import UpdateModal from './UpdateModal';
import UpdateCompleteModal from './UpdateCompleteModal';

function PWAManager() {
  const [showUpdateComplete, setShowUpdateComplete] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      // Vérifie si une mise à jour vient d'être complétée au chargement
      if (sessionStorage.getItem('swUpdateCompleted')) {
        setShowUpdateComplete(true);
        sessionStorage.removeItem('swUpdateCompleted');
      }
    },
    onRegisterError(error) {
      console.log('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  const handleUpdate = async () => {
    // On pose un drapeau pour savoir qu'on a lancé la mise à jour
    sessionStorage.setItem('swUpdateCompleted', 'true');
    // On demande au service worker de s'installer
    await updateServiceWorker(true);
  };

  const handleCloseUpdate = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      <UpdateModal
        show={needRefresh}
        handleClose={handleCloseUpdate}
        onConfirmUpdate={handleUpdate}
      />
      <UpdateCompleteModal
        show={showUpdateComplete}
        handleClose={() => setShowUpdateComplete(false)}
      />
    </>
  );
}

export default PWAManager;
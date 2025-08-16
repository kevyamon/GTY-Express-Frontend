import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useDispatch } from 'react-redux';
import { setUpdateAvailable, setUpdateInProgress } from '../slices/pwaSlice';
import UpdateModal from './UpdateModal';
import UpdateCompleteModal from './UpdateCompleteModal';

function PWAManager() {
  const dispatch = useDispatch();
  const [showUpdateComplete, setShowUpdateComplete] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      if (sessionStorage.getItem('swUpdateCompleted')) {
        setShowUpdateComplete(true);
        sessionStorage.removeItem('swUpdateCompleted');
        // On s'assure que les indicateurs sont à faux après une mise à jour
        dispatch(setUpdateAvailable(false));
        dispatch(setUpdateInProgress(false));
      }
    },
    onRegisterError(error) {
      console.log('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  // Informe Redux qu'une mise à jour est prête
  useEffect(() => {
    dispatch(setUpdateAvailable(needRefresh));
  }, [needRefresh, dispatch]);

  const handleUpdate = async () => {
    // Informe Redux que la mise à jour commence (pour le clignotement)
    dispatch(setUpdateInProgress(true)); 
    sessionStorage.setItem('swUpdateCompleted', 'true');
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
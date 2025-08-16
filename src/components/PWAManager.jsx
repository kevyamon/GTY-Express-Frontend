import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen, setUpdateAvailable, setUpdateInProgress } from '../slices/pwaSlice';
// --- MODIFICATION : On importe le hook pour interroger notre backend ---
import { useGetVersionQuery } from '../slices/apiSlice';
import UpdateModal from './UpdateModal';
import UpdateCompleteModal from './UpdateCompleteModal';

function PWAManager() {
  const dispatch = useDispatch();
  const [showUpdateComplete, setShowUpdateComplete] = useState(false);
  const { isModalOpen } = useSelector((state) => state.pwa);

  // --- MODIFICATION : On interroge notre backend toutes les minutes ---
  // `pollingInterval` force Redux Toolkit Query à redemander les données à intervalle régulier.
  // 60000 millisecondes = 1 minute.
  const { data: versionInfo } = useGetVersionQuery(undefined, {
    pollingInterval: 60000, 
  });

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      if (sessionStorage.getItem('swUpdateCompleted')) {
        setShowUpdateComplete(true);
        sessionStorage.removeItem('swUpdateCompleted');
        dispatch(setUpdateAvailable(false));
        dispatch(setUpdateInProgress(false));
        dispatch(setIsModalOpen(false));
      }
    },
    onRegisterError(error) {
      console.log('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  useEffect(() => {
    if (versionInfo?.commitHash) {
      const lastKnownHash = localStorage.getItem('gitCommitHash');
      
      // Si le hash du backend est différent de celui qu'on a en mémoire...
      if (lastKnownHash !== versionInfo.commitHash) {
        console.log('Nouveau commit détecté ! Vérification de la mise à jour...');
        // ...on déclenche la vérification du Service Worker.
        updateServiceWorker(true);
        // Et on sauvegarde le nouveau hash.
        localStorage.setItem('gitCommitHash', versionInfo.commitHash);
      }
    }
  }, [versionInfo, updateServiceWorker]);

  useEffect(() => {
    if (needRefresh) {
      dispatch(setUpdateAvailable(true));
      dispatch(setIsModalOpen(true));
    }
  }, [needRefresh, dispatch]);

  const handleUpdate = async () => {
    dispatch(setIsModalOpen(false));
    dispatch(setUpdateInProgress(true)); 
    sessionStorage.setItem('swUpdateCompleted', 'true');
    await updateServiceWorker(true);
  };

  const handleCloseUpdate = () => {
    dispatch(setIsModalOpen(false));
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton "Màj".');
  };

  return (
    <>
      <UpdateModal
        show={isModalOpen}
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
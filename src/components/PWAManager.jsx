import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useDispatch } from 'react-redux';
// --- MODIFICATION : On importe la nouvelle action 'setUpdateDeclined' ---
import { setUpdateAvailable, setUpdateInProgress, setUpdateDeclined } from '../slices/pwaSlice';
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
      // --- MODIFICATION : Logique de confirmation de mise à jour ---
      // On vérifie si un marqueur a été placé dans la session avant le rechargement.
      if (sessionStorage.getItem('swUpdateCompleted')) {
        // Si oui, on affiche le modal de succès.
        setShowUpdateComplete(true);
        // Et on retire le marqueur pour ne pas le réafficher au prochain rechargement.
        sessionStorage.removeItem('swUpdateCompleted');
        dispatch(setUpdateAvailable(false));
        dispatch(setUpdateInProgress(false));
        dispatch(setUpdateDeclined(false)); // On réinitialise tout.
      }
    },
    onRegisterError(error) {
      console.log('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  useEffect(() => {
    dispatch(setUpdateAvailable(needRefresh));
  }, [needRefresh, dispatch]);

  const handleUpdate = async () => {
    dispatch(setUpdateInProgress(true)); 
    // On place le marqueur dans la session AVANT de recharger la page.
    sessionStorage.setItem('swUpdateCompleted', 'true');
    await updateServiceWorker(true);
  };

  const handleCloseUpdate = () => {
    // Si l'utilisateur ferme le modal, on note qu'il a refusé la mise à jour.
    dispatch(setUpdateDeclined(true));
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
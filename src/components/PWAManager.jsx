import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useDispatch, useSelector } from 'react-redux';
// --- MODIFICATION : On importe aussi le nouvel état 'isModalOpen' ---
import { setUpdateAvailable, setUpdateInProgress, setIsModalOpen } from '../slices/pwaSlice';
import UpdateModal from './UpdateModal';
import UpdateCompleteModal from './UpdateCompleteModal';

function PWAManager() {
  const dispatch = useDispatch();
  const [showUpdateComplete, setShowUpdateComplete] = useState(false);
  // --- MODIFICATION : On récupère l'état du modal depuis Redux ---
  const { isModalOpen } = useSelector((state) => state.pwa);

  const {
    needRefresh: [needRefresh],
    // on va utiliser la fonction 'updateServiceWorker' pour la vérification automatique
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      // On ajoute un intervalle pour vérifier les mises à jour toutes les heures
      setInterval(() => {
        updateServiceWorker(true);
      }, 1* 60 * 1000); // 1 Minute

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
    // Si une mise à jour est disponible...
    if (needRefresh) {
      // ...on met à jour l'état global...
      dispatch(setUpdateAvailable(true));
      // ...et on demande l'ouverture du modal.
      dispatch(setIsModalOpen(true));
    }
  }, [needRefresh, dispatch]);

  const handleUpdate = async () => {
    dispatch(setIsModalOpen(false)); // On ferme le modal
    dispatch(setUpdateInProgress(true)); 
    sessionStorage.setItem('swUpdateCompleted', 'true');
    await updateServiceWorker(true);
  };

  const handleCloseUpdate = () => {
    // L'utilisateur a cliqué sur "Plus tard", on ferme juste le modal.
    // L'état `isUpdateAvailable` reste `true` en arrière-plan.
    dispatch(setIsModalOpen(false));
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton "Màj".');
  };

  return (
    <>
      <UpdateModal
        show={isModalOpen} // L'affichage du modal est maintenant contrôlé par Redux
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
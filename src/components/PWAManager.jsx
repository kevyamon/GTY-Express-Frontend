import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // On garde toast pour les notifications
import { setIsModalOpen, setUpdateAvailable, setUpdateInProgress } from '../slices/pwaSlice';
import UpdateModal from './UpdateModal';
import UpdateCompleteModal from './UpdateCompleteModal';

// Le nouvel intervalle de vérification en millisecondes (toutes les 60 secondes)
const CHECK_INTERVAL = 60000;

function PWAManager() {
  const dispatch = useDispatch();
  const [showUpdateComplete, setShowUpdateComplete] = useState(false);
  const { isModalOpen } = useSelector((state) => state.pwa);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker enregistré: ${swUrl}`);
      // Cette partie gère l'affichage du modal "Mise à jour terminée"
      if (sessionStorage.getItem('swUpdateCompleted')) {
        setShowUpdateComplete(true);
        sessionStorage.removeItem('swUpdateCompleted');
        // On réinitialise complètement l'état de la mise à jour
        dispatch(setUpdateAvailable(false));
        dispatch(setUpdateInProgress(false));
        dispatch(setIsModalOpen(false));
      }
    },
    onRegisterError(error) {
      console.log('Erreur d\'enregistrement du Service Worker:', error);
    },
  });

  // Ce hook lance la vérification automatique en arrière-plan
  useEffect(() => {
    const interval = setInterval(() => {
      // On demande silencieusement au navigateur de vérifier s'il y a une nouvelle version du SW
      updateServiceWorker(true);
    }, CHECK_INTERVAL);

    // On nettoie l'intervalle quand le composant est détruit
    return () => clearInterval(interval);
  }, [updateServiceWorker]);

  // Ce hook réagit quand le SW nous dit qu'une mise à jour est prête
  useEffect(() => {
    if (needRefresh) {
      dispatch(setUpdateAvailable(true));
      // On attend 5 secondes avant de montrer le modal, comme tu l'as demandé
      setTimeout(() => {
        dispatch(setIsModalOpen(true));
      }, 5000); 
    }
  }, [needRefresh, dispatch]);

  const handleUpdate = async () => {
    dispatch(setIsModalOpen(false));
    dispatch(setUpdateInProgress(true)); 
    sessionStorage.setItem('swUpdateCompleted', 'true');
    await updateServiceWorker(true);
  };

  const handleLater = () => {
    dispatch(setIsModalOpen(false));
    // Le bouton dans le header deviendra rouge grâce à cet état
  };

  return (
    <>
      <UpdateModal
        show={isModalOpen}
        handleClose={handleLater} // Si l'utilisateur clique sur "Plus tard"
        onConfirmUpdate={handleUpdate} // S'il clique sur "Mettre à jour"
      />
      <UpdateCompleteModal
        show={showUpdateComplete}
        handleClose={() => setShowUpdateComplete(false)}
      />
    </>
  );
}

export default PWAManager;
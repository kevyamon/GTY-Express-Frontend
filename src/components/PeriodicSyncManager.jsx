// src/components/PeriodicSyncManager.jsx

import { useEffect } from 'react';
import { toast } from 'react-toastify';

const PeriodicSyncManager = () => {
  useEffect(() => {
    const registerPeriodicSync = async () => {
      // 1. On vérifie si le navigateur supporte cette fonctionnalité
      if (!('serviceWorker' in navigator && 'PeriodicSyncManager' in window)) {
        console.log("La synchronisation périodique n'est pas supportée.");
        return;
      }

      const swRegistration = await navigator.serviceWorker.ready;

      // 2. On demande la permission (sur la plupart des navigateurs, c'est automatique si l'app est installée)
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      });

      if (status.state === 'granted') {
        try {
          // 3. On enregistre une tâche de synchronisation nommée 'update-content'
          await swRegistration.periodicSync.register('update-content', {
            minInterval: 24 * 60 * 60 * 1000, // On demande au navigateur de le faire environ 1x par jour
          });
          console.log('Synchronisation périodique en arrière-plan enregistrée !');
        } catch (error) {
          console.error('Erreur lors de l`enregistrement du Periodic Sync:', error);
          toast.error('Impossible d\'activer la mise à jour automatique.');
        }
      } else {
        console.log("La permission pour la synchronisation en arrière-plan n'a pas été accordée.");
      }
    };

    // On attend 10 secondes après le chargement de la page pour ne pas ralentir le démarrage
    const timer = setTimeout(() => {
      registerPeriodicSync();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Ce composant n'affiche rien à l'écran, il ne fait que travailler en arrière-plan.
  return null; 
};

export default PeriodicSyncManager;
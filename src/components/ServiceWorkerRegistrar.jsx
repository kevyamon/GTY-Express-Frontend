import { useEffect } from 'react';
// On utilise un module spécial fourni par le plugin PWA pour gérer l'enregistrement
import { registerSW } from 'virtual:pwa-register';

const ServiceWorkerRegistrar = () => {
  useEffect(() => {
    // Cette ligne demande au navigateur d'enregistrer notre sw.js
    // et de le mettre à jour si nécessaire.
    registerSW({ immediate: true });
  }, []);

  // Ce composant n'affiche rien à l'écran
  return null;
};

export default ServiceWorkerRegistrar;
import { toast } from 'react-toastify';
import { pushApiSlice } from '../slices/pushApiSlice';
import { apiSlice } from '../slices/apiSlice';

// Fonction pour convertir la clé VAPID
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// --- MODIFICATION : On exporte une fonction au lieu d'un composant ---
export const subscribeUserToPush = async (dispatch) => {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    toast.error("Les notifications push ne sont pas supportées sur ce navigateur.");
    return;
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const existingSubscription = await swRegistration.pushManager.getSubscription();

    if (existingSubscription) {
      toast.info('Vous êtes déjà abonné aux notifications.');
      return;
    }

    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
      toast.warn("Vous n'avez pas autorisé les notifications.");
      return;
    }

    // On récupère la clé VAPID à la volée
    const getVapidKeyAction = pushApiSlice.endpoints.getVapidPublicKey.initiate();
    const { data: vapidPublicKey } = await dispatch(getVapidKeyAction);

    if (!vapidPublicKey) {
        throw new Error("Clé VAPID non récupérée du serveur.");
    }

    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // On envoie l'abonnement au backend
    await dispatch(pushApiSlice.endpoints.subscribeToPush.initiate(subscription)).unwrap();
    
    toast.success('Vous êtes maintenant abonné aux notifications !');

  } catch (error) {
    console.error("Erreur lors de l'abonnement aux notifications push:", error);
    toast.error("L'activation des notifications a échoué. Veuillez réessayer.");
  }
};

// Ce composant ne rend plus rien, il contient juste la logique
const PushNotificationManager = () => {
  return null;
};

export default PushNotificationManager;
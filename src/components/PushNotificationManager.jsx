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


export const subscribeUserToPush = async (dispatch) => {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    toast.error("Les notifications push ne sont pas supportées sur ce navigateur.");
    return false; // --- MODIFICATION : Indiquer l'échec
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const existingSubscription = await swRegistration.pushManager.getSubscription();

    if (existingSubscription) {
      toast.info('Vous êtes déjà abonné aux notifications.');
      return true; // --- MODIFICATION : Indiquer le succès (déjà fait)
    }

    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
      toast.warn("Vous n'avez pas autorisé les notifications.");
      return false; // --- MODIFICATION : Indiquer l'échec
    }

    const getVapidKeyAction = pushApiSlice.endpoints.getVapidPublicKey.initiate();
    
    // --- CORRECTION : Extraire la clé de l'objet JSON ---
    const { data: vapidKeyData } = await dispatch(getVapidKeyAction);

    if (!vapidKeyData || !vapidKeyData.publicKey) {
        throw new Error("Clé VAPID non récupérée du serveur.");
    }
    const vapidPublicKey = vapidKeyData.publicKey;
    // --- FIN DE LA CORRECTION ---

    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    await dispatch(pushApiSlice.endpoints.subscribeToPush.initiate(subscription)).unwrap();
    
    toast.success('Vous êtes maintenant abonné aux notifications !');
    return true; // --- MODIFICATION : Indiquer le succès

  } catch (error) {
    console.error("Erreur lors de l'abonnement aux notifications push:", error);
    toast.error("L'activation des notifications a échoué. Veuillez réessayer.");
    return false; // --- MODIFICATION : Indiquer l'échec
  }
};

const PushNotificationManager = () => {
  return null;
};

export default PushNotificationManager;
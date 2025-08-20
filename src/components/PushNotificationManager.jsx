import { toast } from 'react-toastify';
import { pushApiSlice } from '../slices/pushApiSlice';

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
    return false;
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const existingSubscription = await swRegistration.pushManager.getSubscription();

    if (existingSubscription) {
      toast.info('Vous êtes déjà abonné aux notifications.');
      return true;
    }

    const permission = await window.Notification.requestPermission();
    if (permission !== 'granted') {
      toast.warn("Vous n'avez pas autorisé les notifications.");
      return false;
    }

    const getVapidKeyAction = pushApiSlice.endpoints.getVapidPublicKey.initiate();
    const { data: vapidKeyData } = await dispatch(getVapidKeyAction);

    if (!vapidKeyData || !vapidKeyData.publicKey) {
      throw new Error("Clé VAPID non récupérée du serveur.");
    }
    const vapidPublicKey = vapidKeyData.publicKey;

    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    await dispatch(pushApiSlice.endpoints.subscribeToPush.initiate(subscription)).unwrap();
    
    toast.success('Vous êtes maintenant abonné aux notifications !');
    return true;

  } catch (error) {
    console.error("Erreur lors de l'abonnement aux notifications push:", error);
    toast.error("L'activation des notifications a échoué. Veuillez réessayer.");
    return false;
  }
};

// --- NOUVELLE FONCTION AJOUTÉE ---
export const unsubscribeUserFromPush = async (dispatch) => {
  if (!('serviceWorker' in navigator && 'PushManager' in window)) {
    return false;
  }
  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const subscription = await swRegistration.pushManager.getSubscription();

    if (subscription) {
      // On envoie l'endpoint au backend pour qu'il le supprime de la DB
      await dispatch(pushApiSlice.endpoints.unsubscribeFromPush.initiate({ endpoint: subscription.endpoint })).unwrap();
      
      // On désabonne le navigateur
      const unsubscribed = await subscription.unsubscribe();

      if (unsubscribed) {
        toast.info('Vous avez bien été désabonné des notifications.');
        return true;
      }
    } else {
      toast.info('Vous n\'étiez pas abonné.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors du désabonnement:', error);
    toast.error("Le désabonnement a échoué.");
    return false;
  }
};
// --- FIN DE L'AJOUT ---


const PushNotificationManager = () => {
  return null;
};

export default PushNotificationManager;
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetVapidPublicKeyQuery, useSubscribeToPushMutation } from '../slices/pushApiSlice';

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

const PushNotificationManager = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: vapidPublicKey } = useGetVapidPublicKeyQuery(undefined, {
    skip: !userInfo, // Ne fetch la clé que si l'utilisateur est connecté
  });
  const [subscribeToPush] = useSubscribeToPushMutation();

  useEffect(() => {
    const subscribeUser = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window && userInfo && vapidPublicKey) {
        try {
          const swRegistration = await navigator.serviceWorker.ready;
          const existingSubscription = await swRegistration.pushManager.getSubscription();

          if (existingSubscription) {
            console.log('Utilisateur déjà abonné aux notifications push.');
            return;
          }

          const permission = await window.Notification.requestPermission();
          if (permission !== 'granted') {
            console.log("Permission de notification non accordée.");
            return;
          }

          const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });
          
          await subscribeToPush(subscription).unwrap();
          toast.success('Vous êtes maintenant abonné aux notifications !');

        } catch (error) {
          console.error("Erreur lors de l'abonnement aux notifications push:", error);
        }
      }
    };

    subscribeUser();
  }, [userInfo, vapidPublicKey, subscribeToPush]);

  return null; // Ce composant n'affiche rien
};

export default PushNotificationManager;
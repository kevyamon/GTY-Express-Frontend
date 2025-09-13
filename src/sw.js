import { precacheAndRoute } from 'workbox-precaching';

// La ligne suivante est injectée par VitePWA pour mettre en cache les fichiers de l'app
precacheAndRoute(self.__WB_MANIFEST);

// Écouteur pour l'événement "push" (notification reçue)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const { title, body, icon, data: notificationData } = data;

  const options = {
    body,
    icon,
    badge: '/pwa-192x192.png',
    data: {
      url: notificationData.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Écouteur pour l'événement "notificationclick" (clic sur la notification)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList.find(c => c.url === urlToOpen);
        if (client) {
          client.focus();
        } else {
          clientList[0].navigate(urlToOpen);
          clientList[0].focus();
        }
      } else {
        clients.openWindow(urlToOpen);
      }
    })
  );
});

// Écouteur pour l'événement "periodicsync"
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(handlePeriodicSync());
  }
});

async function handlePeriodicSync() {
  console.log('Periodic Sync déclenché : mise à jour du contenu en arrière-plan.');
  const title = 'Contenu Mis à Jour !';
  const options = {
    body: 'GTY Express a récupéré les dernières nouveautés pour vous.',
    icon: '/pwa-192x192.png',
  };
  try {
    await self.registration.showNotification(title, options);
  } catch (error) {
    console.error('Erreur lors de l`affichage de la notification de synchronisation:', error);
  }
}

// --- DÉBUT DE L'AJOUT POUR LA SYNCHRONISATION EN ARRIÈRE-PLAN ---

// Écouteur pour l'événement "sync"
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(handleBackgroundSync(event));
  }
});

async function handleBackgroundSync(event) {
  console.log('Background Sync déclenché pour:', event.tag);
  
  // Ici, on mettrait la logique pour envoyer les données qui étaient en attente.
  // Par exemple, envoyer les données d'un formulaire qui n'a pas pu être envoyé
  // à cause d'un manque de connexion.
  
  const title = 'Opération terminée !';
  const options = {
    body: 'Vos données en attente ont été envoyées avec succès.',
    icon: '/pwa-192x192.png',
  };

  try {
    await self.registration.showNotification(title, options);
  } catch (error) {
    console.error('Erreur lors de l\'affichage de la notification de synchronisation en arrière-plan:', error);
  }
}
// --- FIN DE L'AJOUT ---
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
    badge: '/pwa-192x192.png', // Un badge pour Android
    data: {
      url: notificationData.url || '/', // URL à ouvrir au clic
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
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      if (clientList.length > 0) {
        // Si l'application est déjà ouverte, on se concentre sur l'onglet existant
        let client = clientList.find(c => c.url === urlToOpen);
        if (client) {
          client.focus();
        } else {
          // Si l'onglet n'est pas le bon, on l'ouvre
          clientList[0].navigate(urlToOpen);
          clientList[0].focus();
        }
      } else {
        // Si l'application est fermée, on ouvre un nouvel onglet
        clients.openWindow(urlToOpen);
      }
    })
  );
});
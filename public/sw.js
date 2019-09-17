self.addEventListener('push', event => {
  const {body, idsegnalazione} = JSON.parse(event.data.text());

  const title = "Aggiornamento";
  const options = {
    body,
    icon: 'icons/icon-96x96.png',
    data: idsegnalazione,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(new Promise(resolve => setTimeout(resolve, 1000)).then(() =>
    clients.openWindow('/dettaglio/' + event.notification.data)
  ));
});
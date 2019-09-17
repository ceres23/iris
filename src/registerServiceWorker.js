const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

export default function register() {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) return;

    window.addEventListener('load', () => {
      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
        navigator.serviceWorker.ready.then(() => {
          console.log("Service worker in esecuzione");
        });
      }
      else return registerValidSW(swUrl);
    });

    window.addEventListener('beforeinstallprompt', (deferredPrompt) => {
      deferredPrompt.preventDefault();
      if(deferredPrompt !== undefined) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted')
            console.log('IRIS è stato installato sul dispositivo');
          deferredPrompt = null;
        });
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker.register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = event => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log("Aggiornamento disponibile. Ricarico la pagina");
            caches.keys().then(names => {
              for (let name of names) caches.delete(name);
            });
            window.location.reload();
          }
        };
      };
    })
    .catch(error => { console.error('Service worker non registrato'); });
}

function checkValidServiceWorker(swUrl) {
  fetch(swUrl)
    .then(response => {
      if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => window.location.reload());
        });
      }
      else registerValidSW(swUrl);
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => registration.unregister());
  }
}